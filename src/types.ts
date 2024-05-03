import type { Generated, ColumnType } from 'kysely'

type ID = string;
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
}
type DBTimestamped = {
  created_at: ColumnType<Timestamped["createdAt"], never, never> | Date;
  updated_at: ColumnType<Timestamped["updatedAt"], never> | Date;
};

export type User = Timestamped & {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  description: string | null;
  profileImage: string | null;
};

export type DBUser =
  Pick<User, "description" | "email"> &
  DBTimestamped &
  {
    id: Generated<User["id"]> | ID;
    first_name: User["firstName"];
    last_name: User["lastName"];
    profile_image: string | null;
    password_hash: string;
  }

export type ProductImage = Timestamped & {
  id: ID;
  productId: Product["id"];
  src: string;
}
export type DBProductImage =
  Pick<ProductImage, "src"> &
  DBTimestamped &
  {
    id: Generated<ProductImage["id"]> | ID;
    product_id: ProductImage["productId"];
  };

export type Product = Timestamped & {
  id: ID;
  name: string;
  description: string;
  images: ProductImage[];
  reviews: Review[];
  sellerId: User["id"];
}
export type DBProduct =
  Pick<Product, "name" | "description"> &
  DBTimestamped &
  {
    id: Generated<ProductImage["id"]> | ID;
    seller_id: Product["sellerId"];
  };

export type Review = Timestamped & {
  id: ID;
  reviewerId: User["id"];
  productId: Product["id"];
  stars: 1 | 2 | 3 | 4 | 5;
  text: string;
};
export type DBReview =
  Pick<Review, "stars" | "text"> &
  DBTimestamped &
  {
    id: Generated<Review["id"]> | ID,
    reviewer_id: Review["reviewerId"],
    product_id: Review["productId"],
  }

export enum DBTableNames {
  Users = "group3_users",
  Products = "group3_products",
  ProductImages = "group3_product_images",
  Reviews = "group3_reviews",
};

export type DataBase = {
  [DBTableNames.Users]: DBUser;
  [DBTableNames.Products]: DBProduct;
  [DBTableNames.ProductImages]: DBProductImage;
  [DBTableNames.Reviews]: DBReview;
};