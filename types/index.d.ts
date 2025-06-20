interface User {
  _id: string;
  name: string;
  isAdmin: boolean;
  telephone: string;
  groupFamily: string;
  urlImage: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Visitor {
  _id?: string;
  name: string;
  telephone: string;
  churchCore: string;
  visitCount?: number;
  lastVisit?: Date;
}

interface Category {
  _id: string;
  name: string;
  image: string;
  urlImage: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface SubCategory {
  _id: string;
  name: string;
  categoryId: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Products {
  _id: string;
  name: string;
  description: string;
  tag: string;
  price: number;
  categoryId: string;
  subcategoryId: string;
  urlImage: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CardProductsProps {
  name: string;
  description?: string;
  price: number;
  urlImage: string;
  _id: string;
  tag?: string;
}

export class CreateOrderDto {
  buyerId: string;
  groupFamilyId: string;
  products: ProductItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class CreateOrderVisitorDto {
  buyerId: string;
  products: ProductItem[];
  totalPrice: number;
  createdAt: Date;
  updatedAt?: Date;
}
