import { useMutation } from "@tanstack/react-query";
import { Login } from "../service/auth";
import { LoginCredentials } from "@/types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => Login(credentials),
  });
};
