import { http } from "./api";

export const GetAllProducts = async () => {
  return (await http.get("products")).data;
};

export const GetProductByCategoryId = async (id: string) => {
  return (await http.get(`products/category/${id}`)).data;
};
