import { useMutation } from "@tanstack/react-query";
import { AddNewOrder, AddNewOrderVisitor } from "../service";

export const useAddOrder = () => {
  return useMutation({
    mutationFn: AddNewOrder,
  });
};

export const useAddOrderVisitor = () => {
  return useMutation({
    mutationFn: AddNewOrderVisitor,
  });
};
