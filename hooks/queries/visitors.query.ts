import { useQuery } from "@tanstack/react-query";
import { GetAllVisitors } from "../service";

export const useVisitors = () => {
  return useQuery({
    queryKey: ["visitors"],
    queryFn: () => GetAllVisitors(),
    retry: 1,
  });
};
