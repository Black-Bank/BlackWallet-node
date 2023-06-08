import axios from "axios";
import { ExtractDomain } from "./Domain";
import { ETHBalanceDataMock, walletsMock } from "./mock";

jest.mock("../Domain/getCoinPrice", () => ({
  CoinPrice: jest.fn(),
}));

describe("ExtractDomain", () => {
  let axiosGetMock: jest.SpyInstance;

  beforeEach(() => {
    axiosGetMock = jest.spyOn(axios, "get");
  });

  afterEach(() => {
    axiosGetMock.mockRestore();
    jest.clearAllMocks();
  });

  it("deve retornar um array vazio quando não houver carteiras", async () => {
    const wallets = [];
    const result = await ExtractDomain(wallets, 100, 100, []);
    expect(result).toEqual([]);
  });

  it("deve retornar o extrato de transações para carteiras ETH e BTC", async () => {
    const result = await ExtractDomain(
      walletsMock,
      1000000,
      10000000,
      ETHBalanceDataMock
    );

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
