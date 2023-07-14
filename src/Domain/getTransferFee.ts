import axios from "axios";
import Web3 from "web3";
import * as bitcore from "bitcore-lib";
import Crypto from "../services/ComunicationSystemAuth";

const web3 = new Web3(
  "https://mainnet.infura.io/v3/7a667ca0597c4320986d601e8cac6a0a"
);
const crypto = new Crypto();
export async function getRecommendedBitcoinFee(
  coin: string,
  addressFrom?: string,
  addressTo?: string,
  value?: number,
  privateKey?: string
) {
  const gasPrice = Number(await web3.eth.getGasPrice());
  if (coin === "ETH") {
    return {
      fatestFee: 21000 * gasPrice,
      MediumFee: 21000 * gasPrice,
      LowFee: 21000 * gasPrice,
      economicFee: 21000 * gasPrice,
    };
  } else {
    // Get UTXOs of the sender address
    const utxosResponse = await axios.get(
      `https://blockchain.info/unspent?active=${addressFrom}`
    );

    const utxos = utxosResponse.data.unspent_outputs;

    if (!utxos || utxos.length === 0) {
      throw new Error("No UTXOs found for the sender address.");
    }

    // Convert UTXOs to bitcore format
    const bitcoreUtxos = utxos.map(
      (utxo) =>
        new bitcore.Transaction.UnspentOutput({
          txid: utxo.tx_hash_big_endian,
          vout: utxo.tx_output_n,
          scriptPubKey: new bitcore.Script(utxo.script),
          satoshis: utxo.value,
        })
    );

    // Create a transaction builder
    const txb = new bitcore.Transaction();

    // Add inputs to the transaction builder
    bitcoreUtxos.forEach((utxo) => {
      txb.from(utxo);
    });

    // Calculate output amount and add recipient output
    const convertFactor = 100000000;
    const outputAmount = Math.floor(value * convertFactor);
    txb.to(addressTo, outputAmount);

    // Sign inputs with sender private key
    bitcoreUtxos.forEach(() => {
      const PrivateKey = new bitcore.PrivateKey(crypto.decrypt(privateKey));
      txb.sign(PrivateKey);
    });
    const transactionHex = txb.serialize();

    // Calcular o tamanho real da transação em bytes
    const transactionSizeBytes = transactionHex.length / 2;

    const response = await axios.get(
      "https://mempool.space/api/v1/fees/recommended"
    );

    const fastestFee = response.data.fastestFee;
    const halfHourFee = response.data.halfHourFee;
    const minimumFee = response.data.minimumFee;

    const recommendedFastestFee = Math.ceil(fastestFee * transactionSizeBytes);
    const MediumFee = Math.ceil(halfHourFee * transactionSizeBytes);
    const MinimumFee = Math.ceil(minimumFee * transactionSizeBytes);

    return {
      fatestFee: recommendedFastestFee,
      MediumFee: MediumFee,
      LowFee: MinimumFee,
      economicFee: MinimumFee,
    };
  }
}
