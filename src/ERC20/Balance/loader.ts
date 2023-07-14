import axios, { AxiosRequestConfig } from "axios";
import { getBalanceERC20 } from "./Domain";

export const BalanceLoaderERC20 = async (
  name: string,
  address: string,
  contractAddress: string,
  contractFactor: number,
  contractType: string
) => {
  const url = `${process.env.PROD_BASE_PAYMENT_URL}/balance/total`;
  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "application/json",
    Authorization: `${process.env.PROD_PAYMENT_AUTH_TOKEN}`,
  };

  const body: AxiosRequestConfig["data"] = {
    name: name,
    address: address,
    contractAddress: contractAddress,
    contractFactor: contractFactor,
    contractType: contractType,
  };

  try {
    const response = await axios.get(url, { headers, data: body });
    const value: number = response.data.value;

    return getBalanceERC20({ contractType, value });
  } catch (err) {
    throw new Error(`An Error Occurred ${err.message}`);
  }
};
