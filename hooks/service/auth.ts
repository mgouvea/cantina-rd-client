import { http } from "@/lib/http";
import { LoginCredentials } from "@/types";

export const Login = async (credentials: LoginCredentials) => {
  return (await http.post("auth/login", credentials)).data;
};
