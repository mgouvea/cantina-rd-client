import { Visitor } from "@/types";
import { http } from "./api";

export const CreateVisitor = async (visitor: Visitor) => {
  return (await http.post("visitors", visitor)).data;
};

export const GetAllVisitors = async () => {
  return (await http.get("visitors")).data;
};

export const GetVisitorById = async (id: string) => {
  return (await http.get(`visitors/${id}`)).data;
};
