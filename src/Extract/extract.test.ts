import axios from "axios";
import { ExtractDomain } from "./Domain";
import { walletsMock, mockBTCResponse } from "./mock";
import { CoinPrice } from "../Domain/getCoinPrice";

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
    const result = await ExtractDomain(wallets);
    expect(result).toEqual([]);
  });

  it("deve retornar o extrato de transações para carteiras ETH e BTC", async () => {
    axiosGetMock.mockResolvedValue(mockBTCResponse);

    const result = await ExtractDomain(walletsMock);

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
