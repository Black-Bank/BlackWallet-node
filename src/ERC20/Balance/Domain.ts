/* eslint-disable no-extra-boolean-cast */
import { ResponseContract } from "./entities";
import { IDollarWallet, IQuery } from "./types";

export const getBalanceERC20 = ({ contractType, value }): ResponseContract => {
  const response = { contractType, value };

  return response;
};

export const getERC20Wallet = async ({ email }: IQuery) => {
  const url = `${process.env.PROD_ACCESS_SECRET_MONGODB}`;
  const mongodb = require("mongodb").MongoClient;

  return new Promise<IDollarWallet | object>((resolve) => {
    mongodb.connect(url, (erro: { message: string }, banco) => {
      if (erro) {
        resolve({});
      }
      const dbo = banco.db("userInfo");

      dbo
        .collection("master")
        .findOne({ Email: email }, async (erro, resultado) => {
          if (erro) {
            throw erro;
          }
          if (Boolean(resultado)) {
            resolve(resultado.DollarWallet);
          }

          banco.close();
        });
    });
  });
};
