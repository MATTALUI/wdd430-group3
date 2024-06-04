import {
  type DBProduct,
  type DBProductImage,
  type DBUser,
  type DBCategory,
  type DBCategoryPicture,
  type DataBase,
  type Product,
  type ProductImage,
  type User,
  DBTableNames,
  type Category,
  type CategoryPicture,
  type Review,
  type DBReview,
  type IQueryBuilder,
  SortOrders,
} from "@/types";
import { type Kysely, sql, Generated } from "kysely";
import { createKysely } from '@vercel/postgres-kysely';
import bcrypt from 'bcrypt';
import { omit, pick } from "lodash";
import { z } from 'zod';

type UserFilter = Partial<Pick<User, "id" | "email">>;

let _db: Kysely<DataBase> | null = null;
const db = () => {
  if (!_db) _db = createKysely<DataBase>();
  return _db;
};

export const mapFormDataToDBUser = async (formData: any): Promise<DBUser> => {
  const { firstName, lastName, email, password } = formData;
  const passwordHash = await bcrypt.hash(password, 10);

  const dbUser: DBUser = {
    id: undefined as unknown as Generated<"id">,
    first_name: firstName,
    last_name: lastName,
    email: email,
    description: null,
    profile_image: null,
    password_hash: passwordHash,
    created_at: new Date(),
    updated_at: new Date(),
  };

  return dbUser;
};


export async function createUser(userData: DBUser) {
  try {
    const createdAt = userData.created_at instanceof Date
      ? userData.created_at
      : new Date(userData.created_at as any);
    const updatedAt = userData.updated_at instanceof Date
      ? userData.updated_at
      : new Date(userData.updated_at as any);

    // Save user to the database
    const result = await db()
      .insertInto(DBTableNames.Users)
      .values({
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        password_hash: userData.password_hash,
        created_at: createdAt,
        updated_at: updatedAt,
      })
      .returning(['id', 'first_name', 'last_name', 'email'])
      .executeTakeFirstOrThrow();

    return { message: true };
  } catch (error: any) {
    if (error.code === '23505') {
      // Duplicate key violation error
      console.error('Error creating user:', error.message);
      return { message: 'Email is already registered', error: error.detail };
    } else {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }
}

export async function updateUser(userId: string, userData: User) {
  try {
    const updatedAt = new Date();

    const updatedFields: Partial<Omit<DBUser, 'id' | 'created_at'>> = {
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      description: userData.description,
      profile_image: userData.profileImage,
      updated_at: updatedAt,
    };

    // Update user in the database
    const result = await db()
      .updateTable(DBTableNames.Users)
      .set(updatedFields as any)
      .where('id', '=', userId)
      .returning(['id', 'first_name', 'last_name', 'email', 'profile_image'])
      .executeTakeFirstOrThrow();

    return { status: true, message: 'Operation successful', updatedUser: result };
  
  } catch (error: any) {
    if (error.code === '23505') {
      return { message: 'Email is already registered', error: error.detail };
    } else {
      return { status: false, message: 'An error occurred', updatedUser: null };
    }
  }
}

export const mapFormDataToDBReview = async (formData: any): Promise<DBReview> => {
  const { stars, text, product_id, reviewer_id } = formData;

  const dbReview: DBReview = {
    id: undefined as unknown as Generated<"id">,
    stars: stars,
    text: text,
    product_id: product_id,
    reviewer_id: reviewer_id, 
    created_at: new Date(),
    updated_at: new Date(),
  };

  return dbReview;
};

export async function createReview(reviewData: Omit<DBReview, "id">) {
  try {
    const result = await db()
      .insertInto(DBTableNames.Reviews)
      .values({
        stars: reviewData.stars,
        text: reviewData.text,
        product_id: reviewData.product_id,
        reviewer_id: reviewData.reviewer_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(['stars', 'text', 'product_id', 'reviewer_id'])
      .executeTakeFirstOrThrow();

    return  result;
  } catch (error: any) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create user');
  }
}

const mapDbUserToUser = (dbUser: DBUser): User => ({
  id: dbUser.id.toString(),
  firstName: dbUser.first_name,
  lastName: dbUser.last_name,
  email: dbUser.email,
  description: dbUser.description,
  profileImage: dbUser.profile_image,
  createdAt: dbUser.created_at as Date,
  updatedAt: dbUser.updated_at as Date,
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
  rating: 0,
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
  if (filter.search)
    productsQuery = productsQuery.where(sql`LOWER(name)`, sql`LIKE`, `%${filter.search}%`)
  Object.entries(omit(filter, "search")).forEach(([key, value]) => {
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
    ]);
    if (product.reviews.length) {
      product.rating = Math.floor(product.reviews.reduce((tot, { stars }) => tot + stars, 0) / product.reviews.length);
    }
  });

  return products;
}

export const getProduct = async (id: DBProduct["id"]): Promise<Product> => {
  const products = await getProducts({ filter: { id } });
  if (!products.length) throw new Error(`Product not found for id: ${id}`);
  return products[0];
}

export const getRandomProducts = async (): Promise<Product[]> => {
  // Fetch product ids from db
  const productIdsResults = await db()
    .selectFrom(DBTableNames.Products)
    .select('id')
    .execute();
  
  // Extract product ids from result
  const productIds = productIdsResults.map(result => result.id);
  
  // Randomize productIDs
  const shuffledProductIds = productIds.sort(() => 0.5 - Math.random());
  const randomProductIds = shuffledProductIds.slice(0, 3);
  
  // Fetch each random product by id
  const randomProductsPromises = randomProductIds.map(id => getProduct(id));
  const randomProducts = await Promise.all(randomProductsPromises);
  
  return randomProducts;
}

const mapDbCategoryToCategory = (dbCategory: DBCategory, pictureSrc: string | null): Category => ({
  id: dbCategory.id.toString(),
  name: dbCategory.name,
  pictureSrc,
});

export const getCategoriesWithPictures = async (): Promise<Category[]> => {
  const categoriesResults = await db()
    .selectFrom(DBTableNames.Categories)
    .select(['id', 'name'])
    .execute();

  const categoryPicturesResults = await db()
    .selectFrom(DBTableNames.CategoryPictures)
    .select(['category_id', 'src'])
    .execute();

  // Join pictures to categories
  const categoryPicturesMap = categoryPicturesResults.reduce((map, picture) => {
    map[picture.category_id] = picture.src;
    return map;
  }, {} as Record<string, string>);

  const categoriesWithPictures = categoriesResults.map(dbCategory => 
    mapDbCategoryToCategory(dbCategory, categoryPicturesMap[dbCategory.id] || null)
  );

  return categoriesWithPictures;
};

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(3, { message: "First name must be 3 or more characters long" }),
  lastName: z.string().trim().min(3, { message: "Last name must be 3 or more characters long" }),
  email: z.string().email({ message: "Invalid email format" }),
  description: z.string().optional(),
  profileImage: z.string().optional(),
});
