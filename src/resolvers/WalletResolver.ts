import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Wallet } from "../entities/Wallet";
import Web3 from "web3";
import { InsertWallet } from "../database/insert";
import { FindWallets } from "../database/findWallets";
import { PrivateKey } from "bitcore-lib";
import { DeleteWallets } from "../Domain/DeleteWallet";
import axios from "axios";
import * as bitcore from "bitcore-lib";
const web3 = new Web3(
  "https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a"
);
@Resolver()
export class WalletResolver {
  @Query(() => [Wallet])
  async getWallets(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string
  ): Promise<Array<Wallet>> {
    return await FindWallets(HashId, key);
  }

  @Mutation(() => Boolean)
  async createEthWallet(
    @Arg("key") key: string,
    @Arg("name") name: string,
    @Arg("HashId") HashId: string
  ): Promise<boolean> {
    const wallet = web3.eth.accounts.wallet.create(0);
    const account = web3.eth.accounts.create();
    wallet.add(account.privateKey);
    let newWallet = {
      name: name,
      WalletType: "ETH",
      address: wallet[wallet.length - 1].address,
      privateKey: wallet[wallet.length - 1].privateKey,
    };
    let lastWallet = await FindWallets(HashId, key);
    return await InsertWallet(newWallet, HashId, key, lastWallet);
  }

  @Mutation(() => Boolean)
  async createBTCWallet(
    @Arg("key") key: string,
    @Arg("name") name: string,
    @Arg("HashId") HashId: string
  ): Promise<Boolean> {
    const privateKey = new PrivateKey();
    const address = privateKey.toAddress();

    let newWallet = {
      name: name,
      WalletType: "BTC",
      address: address.toString(),
      privateKey: privateKey.toString(),
    };
    let lastWallet = await FindWallets(HashId, key);
    return await InsertWallet(newWallet, HashId, key, lastWallet);
  }
  @Mutation(() => String)
  async createTransaction(
    @Arg("coin") coin: string,
    @Arg("addressFrom") addressFrom: string,
    @Arg("privateKey") privateKey: string,
    @Arg("addressTo") addressTo: string,
    @Arg("value") value: number
  ): Promise<string> {
    if (coin === "ETH") {
      const gasPrice = "21000";
      const tx = await web3.eth.accounts.signTransaction(
        {
          from: addressFrom,
          to: addressTo,
          value: web3.utils.toWei(String(value), "ether"),
          chain: "mainnet",
          hardfork: "London",
          gas: gasPrice,
        },
        privateKey
      );

      const createReceipt = await web3.eth.sendSignedTransaction(
        tx.rawTransaction
      );
      return createReceipt.transactionHash;
    }
    if (coin === "BTC") {
      const network = bitcore.Networks.mainnet;

      // Get UTXOs of the sender address
      const utxosResponse = await axios.get(
        `https://api.bitcore.io/api/BTC/mainnet/address/${addressFrom}/utxos`
      );
      const utxos = utxosResponse.data;
      if (!utxos || utxos.length === 0) {
        throw new Error("No UTXOs found for the sender address.");
      }

      // Create a transaction builder
      const transactionBuilder = new bitcore.TransactionBuilder(network);

      // Add inputs to the transaction builder
      let inputAmount = 0;
      utxos.forEach((utxo: any) => {
        transactionBuilder.addInput(utxo.txid, utxo.outputIndex);
        inputAmount += utxo.satoshis;
      });

      // Calculate output amount and add recipient output
      const feePerByte = 1;
      const outputAmount =
        value +
        feePerByte * transactionBuilder.buildIncomplete().toBuffer().length;
      transactionBuilder.addOutput(
        new bitcore.Address(addressTo),
        outputAmount
      );

      // Calculate change amount and add change output
      const changeAmount = inputAmount - outputAmount;
      if (changeAmount < 0) {
        throw new Error("Insufficient funds to cover transaction.");
      }
      if (changeAmount > 0) {
        transactionBuilder.addOutput(
          new bitcore.Address(addressFrom),
          changeAmount
        );
      }

      // Sign inputs with sender private key
      utxos.forEach((utxo: any, index: number) => {
        const privateKey = new bitcore.PrivateKey(PrivateKey);
        transactionBuilder.sign(
          index,
          privateKey,
          undefined,
          bitcore.Transaction.SIGHASH_ALL,
          utxo.satoshis
        );
      });

      // Build and broadcast the transaction
      const transaction = transactionBuilder.build();
      const transactionHex = transaction.toBuffer().toString("hex");
      const broadcastResponse = await axios.post(
        `https://api.bitcore.io/api/BTC/mainnet/tx/send`,
        { rawTx: transactionHex }
      );
      const broadcastResult = broadcastResponse.data;
      if (!broadcastResult || !broadcastResult.txid) {
        throw new Error("Transaction broadcast failed.");
      }

      return broadcastResult.txid;
    }
  }

  @Mutation(() => Boolean)
  async deleteWallet(
    @Arg("HashId") HashId: string,
    @Arg("key") key: string,
    @Arg("address") address: string
  ): Promise<Boolean> {
    return await DeleteWallets(HashId, key, address);
  }
}
