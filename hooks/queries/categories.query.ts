import { useQuery } from "@tanstack/react-query";
import {
  GetAllCategories,
  GetAllSubCategory,
} from "@/hooks/service/categories";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => GetAllCategories(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useSubCategories = () => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: () => GetAllSubCategory(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};
