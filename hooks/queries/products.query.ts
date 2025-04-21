import { useQuery } from "@tanstack/react-query";
import {
  GetAllProducts,
  GetProductByCategoryId,
} from "@/hooks/service/products";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => GetAllProducts(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductsByCategoryId = (id: string | null) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => GetProductByCategoryId(id!),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
