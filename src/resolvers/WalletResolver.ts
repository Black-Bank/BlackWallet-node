import { Resolver, Query, Mutation, Arg, Args } from "type-graphql";
import { Wallet } from "../entities/Wallet";
import Web3 from "web3";
import { InsertWallet } from "../database/insert";
import { FindWallets } from "../database/findWallets";
import { PrivateKey } from "bitcore-lib";
import { DeleteWallets } from "../Domain/DeleteWallet";

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
    console.log("init");
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
  async deleteWallet(
    @Arg("HashId") HashId: string,
    @Arg("key") key: string,
    @Arg("address") address: string
  ): Promise<Boolean> {
    return await DeleteWallets(HashId, key, address);
  }
}
