import axios from "axios";

export async function getRecommendedBitcoinFee(coin) {
  // Busca a taxa média atual em satoshis por byte
  if (coin === "ETH") {
    return {
      fatestFee: 21000,
      MediumFee: 21000,
      LowFee: 21000,
      economicFee: 21000,
    };
  } else {
    const satoshisPerByte = 220;
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

    return {
      fatestFee: recommendedFastestFee,
      MediumFee: MediumFee,
      LowFee: LowFee,
      economicFee: LowestFee,
    };
  }
}
