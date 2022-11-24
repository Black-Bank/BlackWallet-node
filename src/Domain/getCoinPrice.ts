import axios from "axios";

export async function CoinPrice(API_KEY, coin) {
  let priceInfo = 0;
  if (coin === "BTC") {
    const getPrice_url = `https://chain.so/api/v2/get_price/BTC/USD`;
    const response = await axios.get(getPrice_url);
    let exchangeArray = response?.data.data.prices;
    exchangeArray.map((data) => (priceInfo += Number(data.price)));

    return Number((priceInfo / exchangeArray.length).toFixed(2));
  } else if (coin === "ETH") {
    const getPrice_url =
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
    const response = await axios.get(getPrice_url, {
      headers: {
        "X-CMC_PRO_API_KEY": API_KEY,
      },
    });
    let coinInfo = response.data.data.filter((data) => data.symbol === coin);
    let coinPrice = Number(coinInfo[0].quote.USD.price.toFixed(2));

    return coinPrice;
  }
}
