import { useMutation } from "@tanstack/react-query";
import { AddNewOrder } from "../service";

export const useAddOrder = () => {
  return useMutation({
    mutationFn: AddNewOrder,
  });
};
