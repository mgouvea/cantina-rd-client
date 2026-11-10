import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GetAllVisitors, GetVisitorByPhone, GetVisitorgrouped } from "../service";

export const useVisitors = () => {
  return useQuery({
    queryKey: ["visitors"],
    queryFn: () => GetAllVisitors(),
    retry: 1,
  });
};

export const useVisitorsGrouped = (search?: string) => {
  return useQuery({
    queryKey: ["visitors-grouped", search ?? ""],
    queryFn: () => GetVisitorgrouped(search),
    retry: 1,
    placeholderData: keepPreviousData,
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
