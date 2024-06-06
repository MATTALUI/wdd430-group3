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
// Additions for user data handling
export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type DBUserInsert = Omit<DBUser, 'id' | 'created_at' | 'updated_at'> & {
  created_at?: Date;
  updated_at?: Date;
};

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
  price: number;
  images: ProductImage[];
  reviews: Review[];
  seller: Pick<User, "id" | "firstName" | "lastName" | "email">;
  rating: number;
}
export type DBProduct =
  Pick<Product, "name" | "description" | "price"> &
  DBTimestamped &
  {
    id: Generated<ProductImage["id"]> | ID;
    seller_id: User["id"];
  };

export type Review = Timestamped & {
  id: ID;
  reviewerId: User["id"];
  reviewerName: string;
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
  Categories = "group3_categories",
  ProductCategories = "group3_product_categories",
  CategoryPictures = "group3_category_pictures",
};

export type DataBase = {
  [DBTableNames.Users]: DBUser;
  [DBTableNames.Products]: DBProduct;
  [DBTableNames.ProductImages]: DBProductImage;
  [DBTableNames.Reviews]: DBReview;
  [DBTableNames.Categories]: DBCategory;
  [DBTableNames.CategoryPictures]: DBCategoryPicture;
  [DBTableNames.ProductCategories]: DBProductCategory;
};

export type Category = {
  id: ID;
  name: string;
  pictureSrc: string | null;
}

export type DBCategory = {
  id: Generated<Category["id"]> | ID;
  name: string;
} & DBTimestamped;

export type CategoryPicture = {
  categoryId: Category["id"];
  src: string;
}

export type DBProductCategory = {
  product_id: Product["id"]
  category_id: CategoryPicture["categoryId"];
} & DBTimestamped;

export type DBCategoryPicture = {
  category_id: CategoryPicture["categoryId"];
  src: string;
} & DBTimestamped;

export enum SortOrders {
  Ascending = "asc",
  Descending = "desc",
}

export interface IQueryBuilder<T> {
  filter?: Partial<T & {
    search: string;
    category_id: string;
  }>;
  sort?: Partial<{
    key: keyof T;
    order: SortOrders;
    limit: number;
  }>;
}

export type State = {
  errors: {
    seller_id?: string[];
    name?: string[];
    price?: string[];
    description?: string[];
    categories?: string[];
    images?: string[];
  };
  message: string | null;
};