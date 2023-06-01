import { getDollarPriceInReais } from "./Domain";

jest.mock("./Domain", () => ({
  ...jest.requireActual("./Domain"),
  getDollarPriceInReais: jest.fn().mockResolvedValue({ Price: 5.0 }),
}));

describe("getDollarPriceInReais", () => {
  it("should return the dollar price in reais", async () => {
    const result = await getDollarPriceInReais();
    expect(result).toHaveProperty("Price");
    expect(result.Price).toBeGreaterThan(0);
  });

  it("should throw an error when unable to get the dollar price", async () => {
    // Simulate an error by rejecting the mock of getDollarPriceInReais
    (getDollarPriceInReais as jest.Mock).mockRejectedValue(
      new Error("Failed to get exchange rate")
    );

    await expect(getDollarPriceInReais()).rejects.toThrowError(
      "Failed to get exchange rate"
    );
  });
});
