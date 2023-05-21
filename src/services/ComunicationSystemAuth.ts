import CryptoJS from "crypto-js";

const path = require("path");
const dotenvPath = path.resolve(__dirname, "../../.env");
require("dotenv").config({ path: dotenvPath });
class Crypto {
  public encrypt(plaintext: string): string {
    const key = CryptoJS.enc.Hex.parse(
      process.env.NODE_ENV === "prod"
        ? process.env.PROD_AUTH_PRIVATE_KEY
        : process.env.AUTH_PRIVATE_KEY
    );
    const iv = CryptoJS.enc.Hex.parse(
      process.env.NODE_ENV === "prod" ? process.env.PROD_IV : process.env.IV
    );
    const ciphertext = CryptoJS.AES.encrypt(plaintext, key, { iv }).toString();
    return ciphertext;
  }

  public decrypt(ciphertext: string): string {
    const key = CryptoJS.enc.Hex.parse(
      process.env.NODE_ENV === "prod"
        ? process.env.PROD_AUTH_PRIVATE_KEY
        : process.env.AUTH_PRIVATE_KEY
    );
    const iv = CryptoJS.enc.Hex.parse(
      process.env.NODE_ENV === "prod" ? process.env.PROD_IV : process.env.IV
    );
    const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv });
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }
}

export default Crypto;
