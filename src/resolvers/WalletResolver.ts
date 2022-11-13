import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { walletData } from "../database/wallet";
import { Wallet } from "../entities/Wallet";
import Web3 from "web3";
import { InsertWallet } from "../database/insert";
import { FindWallets } from "../database/findWallets";
import { PrivateKey } from "bitcore-lib";

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
    console.log(HashId, key);
    return await FindWallets(HashId, key);
  }

  @Mutation(() => Wallet)
  async createEthWallet(
    @Arg("key") key: string,
    @Arg("name") name: string,
    @Arg("HashId") HashId: string
  ): Promise<Wallet> {
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
    InsertWallet(newWallet, HashId, key, lastWallet);
    return newWallet;
  }

  @Mutation(() => Wallet)
  async createBTCWallet(
    @Arg("key") key: string,
    @Arg("name") name: string,
    @Arg("HashId") HashId: string
  ): Promise<Wallet> {
    const privateKey = new PrivateKey();
    const address = privateKey.toAddress();

    let newWallet = {
      name: name,
      WalletType: "BTC",
      address: address.toString(),
      privateKey: privateKey.toString(),
    };
    let lastWallet = await FindWallets(HashId, key);
    InsertWallet(newWallet, HashId, key, lastWallet);
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
