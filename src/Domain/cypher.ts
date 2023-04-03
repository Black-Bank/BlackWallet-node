const bcrypt = require("bcryptjs");
export function Cypher(text: string) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(text, salt);
  return `${hash}:salt:${salt}`;
}
