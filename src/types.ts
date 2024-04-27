export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  description?: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = User & {
  passwordHash: string;
}

export type ProductImage = {
  id: string;
  productId: Product["id"];
  src: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  images: ProductImage[];
  sellerId: User["id"];
  createdAt: Date;
  updatedAt: Date;
}

export type Review = {
  id: string;
  reviewerId: User["id"];
  productId: Product["id"];
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: Date;
  updatedAt: Date;
};