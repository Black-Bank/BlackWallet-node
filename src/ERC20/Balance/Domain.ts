import { ResponseContract } from "./entities";

export const getBalanceERC20 = ({ contractType, value }): ResponseContract => {
  const response = { contractType, value };

  return response;
};
