import axios, { AxiosRequestConfig } from "axios";

export const SendTokenLoaderERC20 = async (
  name: string,
  addressFrom: string,
  addressTo: string,
  contractAddress: string,
  contractFactor: number,
  amount: number,
  privateKey: string
) => {
  const url = `${process.env.PROD_BASE_PAYMENT_URL}/balance/send`;
  const headers: AxiosRequestConfig["headers"] = {
    "Content-Type": "application/json",
    Authorization: `${process.env.PROD_PAYMENT_AUTH_TOKEN}`,
  };

  const body: AxiosRequestConfig["data"] = {
    name: name,
    addressFrom: addressFrom,
    addressTo: addressTo,
    contractAddress: contractAddress,
    contractFactor: contractFactor,
    amount: amount,
    privateKey: privateKey,
  };

  try {
    const response = await axios.get(url, { headers, data: body });

    return response.data;
  } catch (err) {
    throw new Error(`An Error Occurred ${err.message}`);
  }
};
