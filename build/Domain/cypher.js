"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cypher = void 0;
const bcrypt = require("bcryptjs");
function Cypher(text) {
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(text, salt);
    return `${hash}:salt:${salt}`;
}
exports.Cypher = Cypher;
