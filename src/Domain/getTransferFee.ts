import axios from "axios";
import Web3 from "web3";

const web3 = new Web3(
  "https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a"
);
export async function getRecommendedBitcoinFee(coin) {
  const gasPrice = Number(await web3.eth.getGasPrice());
  if (coin === "ETH") {
    return {
      fatestFee: 21000 * gasPrice,
      MediumFee: 21000 * gasPrice,
      LowFee: 21000 * gasPrice,
      economicFee: 21000 * gasPrice,
    };
  } else {
    const satoshisPerByte = 150;
    const response = await axios.get(
      "https://mempool.space/api/v1/fees/recommended"
    );

    const fastestFee = response.data.fastestFee;
    const halfHourFee = response.data.halfHourFee;
    const lowFee = response.data.hourFee;
    const economicFee = response.data.economyFee;

    const recommendedFastestFee = Math.ceil(fastestFee * satoshisPerByte);
    const MediumFee = Math.ceil(halfHourFee * satoshisPerByte);
    const LowFee = Math.ceil(lowFee * satoshisPerByte);
    const LowestFee = Math.ceil(economicFee * satoshisPerByte);
    const minFee = 4319;

    return {
      fatestFee:
        recommendedFastestFee > minFee ? recommendedFastestFee : minFee,
      MediumFee: MediumFee > minFee ? MediumFee : minFee,
      LowFee: LowFee > minFee ? LowFee : minFee,
      economicFee: LowestFee > minFee ? LowestFee : minFee,
    };
  }
}
