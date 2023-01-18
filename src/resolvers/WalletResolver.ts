import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Wallet } from "../entities/Wallet";
import Web3 from "web3";
import { InsertWallet } from "../database/insert";
import { FindWallets } from "../database/findWallets";
import { PrivateKey } from "bitcore-lib";
import { DeleteWallets } from "../Domain/DeleteWallet";
import axios from "axios";
import { Console } from "console";

const bitcore = require("bitcore-lib");
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
      const sochain_network = "BTC";

      const satoshiToSend = value * 100000000;
      let fee = 5430;
      let inputCount = 0;
      let utxosData = await axios.get(
        `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${addressFrom}`
      );
      let transaction = new bitcore.Transaction().fee(5430);

      let totalAmountAvailable = 0;

      let inputs = [];
      let utxos = utxosData?.data.data.txs;
      for (const element of utxos) {
        let utxo: IUtxo = {};
        utxo.satoshis = Math.floor(Number(element.value) * 100000000);
        utxo.script = element.script_hex;
        utxo.address = addressFrom;
        utxo.txId = element.txid;
        utxo.outputIndex = element.output_no;
        totalAmountAvailable += utxo.satoshis;
        inputCount += 1;
        inputs.push(utxo);
      }

      if (totalAmountAvailable - satoshiToSend - fee < 0) {
        throw new Error("Balance is too low for this transaction");
      }

      transaction.from(inputs);
      transaction.to(addressTo, satoshiToSend);

      transaction.change(addressFrom);
      transaction.sign(privateKey);
      const serializedTX = transaction.serialize();
      const result = await axios({
        method: "POST",
        url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
        data: {
          tx_hex: serializedTX,
        },
      });
      return result.data.data.txid;
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
