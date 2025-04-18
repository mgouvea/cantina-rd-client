import { useQuery } from "@tanstack/react-query";
import { GetAllProducts } from "@/hooks/service/products";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => GetAllProducts(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
