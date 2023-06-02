"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const Domain_1 = require("./Domain");
const mock_1 = require("./mock");
jest.mock("../Domain/getCoinPrice", () => ({
    CoinPrice: jest.fn(),
}));
describe("ExtractDomain", () => {
    let axiosGetMock;
    beforeEach(() => {
        axiosGetMock = jest.spyOn(axios_1.default, "get");
    });
    afterEach(() => {
        axiosGetMock.mockRestore();
        jest.clearAllMocks();
    });
    it("deve retornar um array vazio quando não houver carteiras", async () => {
        const wallets = [];
        const result = await (0, Domain_1.ExtractDomain)(wallets);
        expect(result).toEqual([]);
    });
    it("deve retornar o extrato de transações para carteiras ETH e BTC", async () => {
        axiosGetMock.mockResolvedValue(mock_1.mockBTCResponse);
        const result = await (0, Domain_1.ExtractDomain)(mock_1.walletsMock);
        expect(result.length).toBeGreaterThan(0);
        expect(result[0]).toHaveProperty("hash");
        expect(result[0]).toHaveProperty("type");
        expect(result[0]).toHaveProperty("addressFrom");
        expect(result[0]).toHaveProperty("addressTo");
        expect(result[0]).toHaveProperty("value");
        expect(result[0]).toHaveProperty("confirmed");
        expect(result[0]).toHaveProperty("date");
        expect(result[0]).toHaveProperty("fee");
    });
});
