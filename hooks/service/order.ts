import { http } from "./api";
import { CreateOrderDto, CreateOrderVisitorDto } from "@/types";

export const AddNewOrder = async (payload: CreateOrderDto) => {
  return (await http.post("orders", payload)).data;
};

export const AddNewOrderVisitor = async (payload: CreateOrderVisitorDto) => {
  return (await http.post("orders-visitors", payload)).data;
};
