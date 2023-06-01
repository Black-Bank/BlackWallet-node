import axios from "axios";
import { DolarPrice } from "./entities/dolarPrice";

async function getExchangeRate(): Promise<number> {
  try {
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD"
    );
    const exchangeRate = response.data.rates.BRL;
    return exchangeRate;
  } catch (error) {
    console.error("Erro ao obter a taxa de câmbio:", error);
    throw error;
  }
}

export async function getDollarPriceInReais(): Promise<DolarPrice> {
  try {
    const exchangeRate = await getExchangeRate();
    const dollarPrice = exchangeRate;
    return { Price: dollarPrice };
  } catch (error) {
    throw error;
  }
}
