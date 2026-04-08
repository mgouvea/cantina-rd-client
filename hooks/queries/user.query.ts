import { GetAllUsers, GetUserById } from "@/hooks/service/user";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => GetAllUsers(),
    retry: 1,
    staleTime: 1000 * 60 * 60 * 12, // 12 horas - tempo que o dado é considerado "fresh"
    gcTime: 1000 * 60 * 60 * 14, // 14 horas - tempo que o dado fica na memória
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => GetUserById(id),
  });
};
