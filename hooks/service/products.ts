import { http } from "./api";

export const GetAllProducts = async () => {
  return (await http.get("products")).data;
};
