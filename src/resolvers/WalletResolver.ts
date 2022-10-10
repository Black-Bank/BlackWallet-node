import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { walletData } from "../database/wallet";
import { Wallet } from "../entities/Wallet";
import Web3 from "web3";
import { InsertWallet } from "../database/insert";
import { FindWallets } from "../database/findWallets";

const web3 = new Web3(
  "https://rinkeby.infura.io/v3/1b8c4e37898645a4854090b9600c6490"
);

//const CoinKey = require("coinkey");
//const wallet = new CoinKey.createRandom();
@Resolver()
export class WalletResolver {
  @Query(() => [Wallet])
  async getWallets(
    @Arg("key") key: string,
    @Arg("HashId") HashId: string
  ): Promise<Array<Wallet>> {
    /*console.log(
      "SAVE BUT DO NOT SHARE THIS:",
      wallet.privateKey.toString("hex")
    );
    console.log("Address:", wallet.publicAddress);*/
    //console.log("init");
    return await FindWallets(HashId, key);
  }

  @Mutation(() => Wallet)
  createEthWallet(
    @Arg("key") key: string,
    @Arg("name") name: string,
    @Arg("type") type: string,
    @Arg("HashId") HashId: string
  ): Wallet {
    const wallet = web3.eth.accounts.wallet.create(0);
    const account = web3.eth.accounts.create();
    wallet.add(account.privateKey);
    let newWallet = {
      name: name,
      type: type,
      address: wallet[wallet.length - 1].address,
      privateKey: wallet[wallet.length - 1].privateKey,
    };
    InsertWallet(newWallet, HashId, key);
    return newWallet;
  }
  @Mutation(() => String)
  async createTransaction(
    @Arg("addressFrom") addressFrom: string,
    @Arg("privateKey") privateKey: string,
    @Arg("addressTo") addressTo: string,
    @Arg("value") value: number
  ): Promise<string> {
    const tx = await web3.eth.accounts.signTransaction(
      {
        from: addressFrom,
        to: addressTo,
        value: web3.utils.toWei(String(value), "ether"),
        chain: "rinkeby",
        hardfork: "London",
        gas: "210000",
      },
      privateKey
    );

    const createReceipt = await web3.eth.sendSignedTransaction(
      tx.rawTransaction
    );

    return createReceipt.transactionHash;
  }

  @Mutation(() => Boolean)
  deleteWallet(@Arg("name") name: string): boolean {
    let walletIndex = walletData.findIndex((wallet) => wallet.name === name);

    if (walletIndex > -1) {
      walletData.splice(walletIndex, 1);
      return true;
    }
    return false;
  }
}
