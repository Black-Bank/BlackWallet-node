"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cypher = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function Cypher(text) {
    const salt = bcryptjs_1.default.genSaltSync();
    const hash = bcryptjs_1.default.hashSync(text, salt);
    return `${hash}`;
}
exports.Cypher = Cypher;
