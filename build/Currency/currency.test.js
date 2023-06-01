"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Domain_1 = require("./Domain");
jest.mock("./Domain", () => ({
    ...jest.requireActual("./Domain"),
    getDollarPriceInReais: jest.fn().mockResolvedValue({ Price: 5.0 }),
}));
describe("getDollarPriceInReais", () => {
    it("should return the dollar price in reais", async () => {
        const result = await (0, Domain_1.getDollarPriceInReais)();
        expect(result).toHaveProperty("Price");
        expect(result.Price).toBeGreaterThan(0);
    });
    it("should throw an error when unable to get the dollar price", async () => {
        // Simulate an error by rejecting the mock of getDollarPriceInReais
        Domain_1.getDollarPriceInReais.mockRejectedValue(new Error("Failed to get exchange rate"));
        await expect((0, Domain_1.getDollarPriceInReais)()).rejects.toThrowError("Failed to get exchange rate");
    });
});
