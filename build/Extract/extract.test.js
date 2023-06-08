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
        const result = await (0, Domain_1.ExtractDomain)(wallets, 100, 100, []);
        expect(result).toEqual([]);
    });
    it("deve retornar o extrato de transações para carteiras ETH e BTC", async () => {
        const result = await (0, Domain_1.ExtractDomain)(mock_1.walletsMock, 1000000, 10000000, mock_1.ETHBalanceDataMock);
        const expectedBTCObject = [
            {
                hash: "b40d02af61ab19b0a0ac479cfb4ad25f1d64bcb8d4299d70119058605af11005",
                type: "BTC",
                addressFrom: "1C8s9wPNaXwYAAP5gfgP7nkQwTzJfxEQAy",
                addressTo: "1q6WZD4kxpCXfQhxEaPqtRTyRAfXKZDhA",
                value: 1000,
                coinValue: 0.000057,
                confirmed: true,
                date: new Date("2023-05-26T00:21:06.000Z"),
                fee: 570,
                prevout: 0.0000435,
            },
            {
                hash: "0xd9eeed4dc46e6756c7af8e696c8361c5d8912425bc2744b1996766a45fe4ca61",
                type: "ETH",
                addressFrom: "0xa538071dd679c3457109f70743c394f3819cb73a",
                addressTo: "0x68f5c5f565b77d7e0a26e4fcca3965c3cf85eab4",
                value: 1,
                coinValue: 0.000001,
                confirmed: true,
                date: new Date("2023-05-19T22:02:23.000Z"),
                fee: 721.62,
                balance: 0.00009963264960354,
            },
        ];
        expect(result.length).toBeGreaterThan(0);
        expect(result).toMatchObject(expectedBTCObject);
    });
});
