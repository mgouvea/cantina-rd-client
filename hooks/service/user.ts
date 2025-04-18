import { http } from "./api";

export const GetAllUsers = async () => {
  return (await http.get("users")).data;
};

export const GetUserById = async (id: string) => {
  return (await http.get(`users/${id}`)).data;
};
