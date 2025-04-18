import { GetAllUsers, GetUserById } from "@/hooks/service/user";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(),
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => GetUserById(id),
  });
};
