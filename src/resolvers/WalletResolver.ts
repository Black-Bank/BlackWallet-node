import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Wallet } from "../entities/Wallet";
import Web3 from "web3";
import { InsertWallet } from "../database/insert";
import { FindWallets } from "../database/findWallets";
import { PrivateKey } from "bitcore-lib";
import { DeleteWallets } from "../Domain/DeleteWallet";
import axios from "axios";
import * as bitcore from "bitcore-lib";
import Crypto from "../services/ComunicationSystemAuth";
const web3 = new Web3(
  "https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a"
);
const crypto = new Crypto();
@Resolver()
export class WalletResolver {
  @Mutation(() => Boolean)
  async createEthWallet(
    @Arg("name") name: string,
    @Arg("Email") Email: string
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
    let lastWallet = await FindWallets(Email);
    return await InsertWallet(newWallet, Email, lastWallet);
  }

  @Mutation(() => Boolean)
  async createBTCWallet(
    @Arg("name") name: string,
    @Arg("Email") Email: string
  ): Promise<Boolean> {
    const privateKey = new PrivateKey();
    const address = privateKey.toAddress();
    let newWallet = {
      name: name,
      WalletType: "BTC",
      address: address.toString(),
      privateKey: crypto.encrypt(privateKey.toString()),
    };
    let lastWallet = await FindWallets(Email);
    return await InsertWallet(newWallet, Email, lastWallet);
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
        crypto.decrypt(privateKey)
      );

      const createReceipt = await web3.eth.sendSignedTransaction(
        tx.rawTransaction
      );
      return createReceipt.transactionHash;
    }
    if (coin === "BTC") {
      // Get UTXOs of the sender address
      const utxosResponse = await axios.get(
        `https://blockchain.info/unspent?active=${addressFrom}`
      );

      const utxos = utxosResponse.data.unspent_outputs;
      if (!utxos || utxos.length === 0) {
        throw new Error("No UTXOs found for the sender address.");
      }

      // Convert UTXOs to bitcore format
      const bitcoreUtxos = utxos.map(
        (utxo) =>
          new bitcore.Transaction.UnspentOutput({
            txid: utxo.tx_hash_big_endian,
            vout: utxo.tx_output_n,
            scriptPubKey: new bitcore.Script(utxo.script),
            satoshis: utxo.value,
          })
      );

      let fee = 3430;

      // Create a transaction builder
      const txb = new bitcore.Transaction();

      if (value < 5430) {
        // change fee value on conditional
        fee = txb.toBuffer().length;
      }
      // Add inputs to the transaction builder
      let inputAmount = 0;
      bitcoreUtxos.forEach((utxo) => {
        txb.from(utxo);
        inputAmount += utxo.satoshis;
      });

      // Calculate output amount and add recipient output

      const outputAmount = value;
      txb.fee(fee).to(addressTo, outputAmount);

      // Calculate change amount and add change output
      const changeAmount = inputAmount - outputAmount - fee;
      if (changeAmount < 0) {
        throw new Error("Insufficient funds to cover transaction.");
      }

      if (changeAmount > 0) {
        txb.change(addressFrom);
      }

      // Sign inputs with sender private key
      bitcoreUtxos.forEach((utxo, index) => {
        const PrivateKey = new bitcore.PrivateKey(crypto.decrypt(privateKey));
        txb.sign(PrivateKey, index);
      });

      // Build and broadcast the transaction
      const txHex = txb.serialize();

      const broadcastResponse = await axios.post(
        `https://api.bitcore.io/api/BTC/mainnet/tx/send`,
        { rawTx: txHex }
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
    @Arg("Email") Email: string,
    @Arg("address") address: string
  ): Promise<Boolean> {
    return await DeleteWallets(Email, address);
  }
}
