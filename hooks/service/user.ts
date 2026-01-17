import { http } from "@/lib/http";

export const GetAllUsers = async () => {
  return (await http.get("users/active")).data;
};

export const GetUserById = async (id: string) => {
  return (await http.get(`users/${id}`)).data;
};
