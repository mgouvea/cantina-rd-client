import { http } from "./api";

export const GetAllCategories = async () => {
  return (await http.get("categories")).data;
};

export const GetAllSubCategory = async () => {
  return (await http.get("subcategories")).data;
};
