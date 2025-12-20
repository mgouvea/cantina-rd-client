import { http } from "@/lib/http";

export const GetAllCategories = async () => {
  return (await http.get("categories")).data;
};

export const GetAllSubCategory = async () => {
  return (await http.get("subcategories")).data;
};
