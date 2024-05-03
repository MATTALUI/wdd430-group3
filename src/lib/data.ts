import {
  type DBProduct,
  type DBProductImage,
  type DBUser,
  type DataBase,
  type Product,
  type ProductImage,
  type User,
  DBTableNames,
  type Review,
  DBReview,
} from "@/types";
import type { Kysely } from "kysely";
import { createKysely } from '@vercel/postgres-kysely';

type UserFilter = Partial<Pick<User, "id" | "email">>;

let db: Kysely<DataBase> | null = null;
const useDB = () => {
  if (!db) db = createKysely<DataBase>();
  return db;
};

const mapDbUserToUser = (dbUser: DBUser): User => ({
  id: dbUser.id.toString(),
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  email: dbUser.email,
  description: dbUser.description,
  profileImage: dbUser.profile_image,
  createdAt: dbUser.created_at as Date,
  updatedAt: dbUser.created_at as Date,
});

const mapDbProductToProduct = (dbProduct: DBProduct): Product => ({
  id: dbProduct.id.toString(),
  name: dbProduct.name,
  description: dbProduct.description,
  images: [],
  reviews: [],
  sellerId: dbProduct.seller_id,
  createdAt: dbProduct.created_at as Date,
  updatedAt: dbProduct.updated_at as Date,
});

const mapDbProductImageToProductImage = (
  dbProductImage: DBProductImage
): ProductImage => ({
  id: dbProductImage.id.toString(),
  productId: dbProductImage.product_id,
  src: dbProductImage.src,
  createdAt: dbProductImage.created_at as Date,
  updatedAt: dbProductImage.updated_at as Date,
});

const mapDbReviewToReview = (
  dbReview: DBReview
): Review => ({
  id: dbReview.id.toString(),
  reviewerId: dbReview.reviewer_id,
  productId: dbReview.product_id,
  stars: dbReview.stars,
  text: dbReview.text,
  createdAt: dbReview.created_at as Date,
  updatedAt: dbReview.updated_at as Date,
});

export const getDBUser = async (filter: UserFilter): Promise<DBUser> => {
  const filterEntries = Object.entries(filter);
  if (!filterEntries.length)
    throw new Error("getUser requires either 'email' or 'id' filter");
  let query = useDB()
    .selectFrom(DBTableNames.Users)
    .selectAll();
  filterEntries.forEach(([key, value]) => {
    query = query.where(key as keyof DBUser, '=', value);
  });
  const dbUser = await query.executeTakeFirstOrThrow();

  return dbUser;
}

export const getUser = async (filter: UserFilter): Promise<User> => {
  const dbUser = await getDBUser(filter);

  return mapDbUserToUser(dbUser);
}

export const getUserAuthentication = async (filter: UserFilter) => {
  const dbUser = await getDBUser(filter);
  const user = mapDbUserToUser(dbUser);
  const { password_hash: passwordHash } = dbUser;

  return { user, passwordHash };
}

export const getProducts = async (): Promise<Product[]> => {
  await new Promise(res => setTimeout(res, 3000));
  const productsQuery = useDB().selectFrom(DBTableNames.Products).selectAll();
  const productsResults = await productsQuery.execute();
  const products = productsResults.map(mapDbProductToProduct);
  const productIds = Array.from(products.reduce((ids, product) => {
    ids.add(product.id);
    return ids;
  }, new Set<Product["id"]>()));

  const [
    imageResults,
    reviewResults,
  ] = await Promise.all([
    useDB().selectFrom(DBTableNames.ProductImages)
      .selectAll()
      .where('product_id', 'in', productIds)
      .execute(),
    useDB().selectFrom(DBTableNames.Reviews)
      .selectAll()
      .where('product_id', 'in', productIds)
      .execute(),
  ]);
  const imageMap = imageResults
    .map(mapDbProductImageToProductImage)
    .reduce((map: Record<string, ProductImage[]>, image: ProductImage) => {
      if (!Object.hasOwn(map, image.productId)) map[image.productId] = [];
      map[image.productId].push(image);
      return map;
    }, {});
  const reviewMap = reviewResults
    .map(mapDbReviewToReview)
    .reduce((map: Record<string, Review[]>, review: Review) => {
      if (!Object.hasOwn(map, review.productId)) map[review.productId] = [];
      map[review.productId].push(review);
      return map;
    }, {});
  products.forEach((product) => {
    product.images = imageMap[product.id] || [];
    product.reviews = reviewMap[product.id] || [];
  });

  return products;
}