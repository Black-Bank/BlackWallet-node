const crypto = require("crypto");

export function Cypher(text: string, criptoKey: string) {
  const iv = crypto.randomBytes(16);
  const algo = "aes-256-ctr";
  const cipher = crypto.createCipheriv(algo, criptoKey, iv);
  const crypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return `${iv.toString("hex")}:${crypted}`;
}
