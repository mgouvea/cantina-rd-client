import { useQuery } from "@tanstack/react-query";
import { GetAllVisitors, GetVisitorByPhone } from "../service";

export const useVisitors = () => {
  return useQuery({
    queryKey: ["visitors"],
    queryFn: () => GetAllVisitors(),
    retry: 1,
  });
};

export const useVisitorByPhone = (phone: string) => {
  return useQuery({
    queryKey: ["visitor-phone", phone],
    queryFn: () => GetVisitorByPhone(phone),
    retry: 1,
    enabled: !!phone,
  });
};
