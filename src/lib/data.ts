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
  type DBReview,
  type IQueryBuilder,
  SortOrders,
} from "@/types";
import type { Kysely } from "kysely";
import { createKysely } from '@vercel/postgres-kysely';
import { pick } from "lodash";

type UserFilter = Partial<Pick<User, "id" | "email">>;

let _db: Kysely<DataBase> | null = null;
const db = () => {
  if (!_db) _db = createKysely<DataBase>();
  return _db;
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
  price: dbProduct.price,
  description: dbProduct.description,
  images: [],
  reviews: [],
  seller: {
    id: dbProduct.seller_id,
    firstName: "User",
    lastName: "Unavailable",
    email: ":(",
  },
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
  let query = db()
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

export const getProducts = async ({
  filter: filterOverrides,
  sort: sortOverrides,
}: IQueryBuilder<DBProduct> = {}): Promise<Product[]> => {
  const filter = {
    ...filterOverrides,
  };
  const sort = {
    key: "created_at" as const,
    order: SortOrders.Descending,
    limit: 25,
    ...sortOverrides,
  };
  await new Promise(res => setTimeout(res, 3000));
  let productsQuery = db()
    .selectFrom(DBTableNames.Products)
    .selectAll()
    .orderBy(sort.key, sort.order)
    .limit(sort.limit);
  Object.entries(filter).forEach(([key, value]) => {
    productsQuery = productsQuery.where(key as keyof DBProduct, '=', value as any);
  });
  const productsResults = await productsQuery.execute();
  const sellerIds = Array.from(productsResults.reduce((ids, product) => {
    ids.add(product.seller_id);
    return ids;
  }, new Set<User["id"]>()));
  const products = productsResults.map(mapDbProductToProduct);
  if (!products.length) return products;
  const productIds = Array.from(products.reduce((ids, product) => {
    ids.add(product.id);
    return ids;
  }, new Set<Product["id"]>()));

  const [
    imageResults,
    reviewResults,
    sellerResults,
  ] = await Promise.all([
    db().selectFrom(DBTableNames.ProductImages)
      .selectAll()
      .where('product_id', 'in', productIds)
      .execute(),
    db().selectFrom(DBTableNames.Reviews)
      .selectAll()
      .where('product_id', 'in', productIds)
      .execute(),
    // This could probably just be a join.
    db().selectFrom(DBTableNames.Users)
      .selectAll()
      .where('id', 'in', sellerIds)
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
  const sellerMap = sellerResults
    .map(mapDbUserToUser)
    .reduce((map: Record<string, User>, seller: User) => {
      if (!Object.hasOwn(map, seller.id)) map[seller.id] = seller;
      return map;
    }, {});
  products.forEach((product) => {
    product.images = imageMap[product.id] || [];
    product.reviews = reviewMap[product.id] || [];
    product.seller = pick(sellerMap[product.seller.id], [
      "id",
      "firstName",
      "lastName",
      "email",
    ])
  });

  return products;
}