import CryptoJS from "crypto-js";

class Crypto {
  private encryptionKey: string;
  private decryptionKey: string;
  private iv: string;

  constructor(encryptionKey: string, decryptionKey: string, iv: string) {
    this.encryptionKey = encryptionKey;
    this.decryptionKey = decryptionKey;
    this.iv = iv;
  }

  public encrypt(plaintext: string): string {
    const key = CryptoJS.enc.Hex.parse(this.encryptionKey);
    const iv = CryptoJS.enc.Hex.parse(this.iv);
    const ciphertext = CryptoJS.AES.encrypt(plaintext, key, { iv }).toString();
    return ciphertext;
  }

  public decrypt(ciphertext: string): string {
    const key = CryptoJS.enc.Hex.parse(this.decryptionKey);
    const iv = CryptoJS.enc.Hex.parse(this.iv);
    const bytes = CryptoJS.AES.decrypt(ciphertext, key, { iv });
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
  }
}

export default Crypto;
