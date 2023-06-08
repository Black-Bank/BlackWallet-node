import axios from "axios";
import * as bitcore from "bitcore-lib";
import Crypto from "../services/ComunicationSystemAuth";

const cripto = new Crypto();

export async function replaceTransaction(
  originalTxId: string,
  addressFrom: string,
  toAddress: string,
  privateKey: string,
  newFee: number
): Promise<string> {
  // Get transaction details
  const transactionDetails = await axios.get(
    `https://mempool.space/api/tx/${originalTxId}`
  );
  const transactionDetailsData = transactionDetails.data;

  // Get UTXOs of the sender address
  const utxosResponse = await axios.get(
    `https://blockchain.info/unspent?active=${addressFrom}`
  );
  const utxos = utxosResponse.data.unspent_outputs;

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

  bitcoreUtxos.forEach((utxo) => {
    txb.from(utxo);
  });

  // Calculate output amount and add recipient output

  const outputAmount = Math.floor(
    transactionDetailsData.vout.find(
      (data) => data.scriptpubkey_address === toAddress
    ).value
  );
  txb.to(toAddress, outputAmount).fee(newFee);

  // Calculate change amount and add change output if necessary
  const inputAmount = bitcoreUtxos.reduce(
    (total, utxo) => total + utxo.satoshis,
    0
  );
  const changeAmount = inputAmount - outputAmount - newFee;
  if (changeAmount > 0) {
    txb.change(addressFrom);
  }

  // Sign inputs with sender private key
  bitcoreUtxos.forEach(() => {
    const privateKeyInstance = new bitcore.PrivateKey(
      cripto.decrypt(privateKey)
    );
    txb.sign(privateKeyInstance);
  });

  const txHex = txb.serialize();

  const broadcastResponse = await axios.post(
    `https://api.bitcore.io/api/BTC/mainnet/tx/send`,
    { rawTx: txHex }
  );

  const broadcastResult = broadcastResponse.data;
  if (!broadcastResult || !broadcastResult.txid) {
    throw new Error("Transaction broadcast failed.");
  }

  return broadcastResult.txid;
}
