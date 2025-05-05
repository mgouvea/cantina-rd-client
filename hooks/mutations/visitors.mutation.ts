import { useMutation } from "@tanstack/react-query";
import { CreateVisitor } from "../service";

export const useAddVisitor = () => {
  return useMutation({
    mutationFn: CreateVisitor,
  });
};
