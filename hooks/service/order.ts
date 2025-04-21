import { http } from "./api";
import { CreateOrderDto } from "@/types";

export const AddNewOrder = async (payload: CreateOrderDto) => {
  return (await http.post("orders", payload)).data;
};
