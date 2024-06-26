"use server"

import { signIn } from "@/auth";
import { sql } from "@vercel/postgres";
import { AuthError } from "next-auth";
import { createUser, createReview, updateUser } from "@/lib/data";
import { mapFormDataToDBUser, mapFormDataToDBReview } from "@/lib/data";
import { DBReview } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function processFormData (formData: any)  {
  try {
    const dbUser = await mapFormDataToDBUser(formData);
    const data = await createUser(dbUser);
    return data;
  } catch (error) {
    console.error("Error processing form data:", error);
    throw new Error("Failed to process form data");
  }
};

export async function updateProfileFormData (id: string, formData: any)  {
  try {
    const res = await updateUser(id,formData);
    return res;
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error('Failed to process form data');
  }
};

export async function processReviewFormData (review: Omit<DBReview, "id">)  {
  try {
    await createReview(review);
  } catch (error) {
    console.error("Error processing form data:", error);
    throw new Error("Failed to process form data");
  }
};

// Validate data types with zod:
const ProductSchema = z.object({
  id: z.string(),
  seller_id: z.string().uuid(),
  name: z.string({
    invalid_type_error: "Product name must be a string."}).min(1, "Product name cannot be empty!"),
  price: z.coerce
      .number()
      .gt(0, { message: "The price must be greater than $0." }),
  description: z.string().min(10, "Description must be at least 10 characters."),
  categories: z.array( z.string().uuid()),
  images: z.string(),
});

const ProductData = ProductSchema.omit( { id: true } );

export async function createProduct( formData: FormData ) {

  const validatedFields = ProductData.safeParse({
    seller_id: formData.get("seller_id"),
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    categories: formData.getAll("categories"),
    images: formData.get("images")
  });
  

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    console.error("something bad happened!")
    console.error(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields, failed to Create Product.",
    };
  }

  // Prepare data for insertion into the database
  const { seller_id, name, price, description, categories, images } = validatedFields.data;

  try {

    // Add product to DB:
    const createdProduct = await sql`
      INSERT INTO group3_products (seller_id, name, price, description)
      VALUES (${seller_id}, ${name}, ${Math.round(+price)}, ${description})
      RETURNING *;
    `;

    const [insertedProduct] = createdProduct.rows;
    const pId = insertedProduct.id;
    const imagesUrls = JSON.parse(images);

    imagesUrls.forEach(async (url: string) => {
      await sql`
      INSERT INTO group3_product_images (src, product_id)
      VALUES (${url}, ${pId});
    `;
    });
 
    categories.forEach(async (categoryId: string) => {
      await sql`
      INSERT INTO group3_product_categories (product_id, category_id)
      VALUES (${pId}, ${categoryId});
    `;
    });

  } catch (error) {
    console.error("Database Error: ", error);
    return {
        message: "Database Error: Failed to Create Product.",
      };
  }
  revalidatePath("/products/"); // Clear cache and trigger new request to the server
  redirect("/products"); // Redirect the user back to the /products page
}

export async function editProduct(id: string, formData: FormData) {

  const validatedFields = ProductData.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    categories: formData.getAll("categories"),
    images: formData.get("images")
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Product.",
    };
  }
  // Prepare data for insertion into the database
  const { name, price, description, categories, images } = validatedFields.data;

  try {
    // Update product in the DB:
    await sql`
      UPDATE group3_products
      SET name = ${name}, price = ${price}, description = ${description}
      WHERE id = ${id}
    `;

    const imagesUrls = JSON.parse(images);

    // Update images in the DB
    await sql`
      DELETE FROM group3_product_images
      WHERE product_id = ${id}
    `;

    await Promise.all(imagesUrls.map((url: string) => sql`
      INSERT INTO group3_product_images (src, product_id)
      VALUES (${url}, ${id})
    `));

    // Update categories in the DB
    await sql`
      DELETE FROM group3_product_categories
      WHERE product_id = ${id}
    `;

    await Promise.all(categories.map((categoryId: string) => sql`
      INSERT INTO group3_product_categories (product_id, category_id)
      VALUES (${id}, ${categoryId})
    `));

  } catch (error) {
    console.error("Database Error: ", error);
    return {
      message: "Database Error: Failed to Update Product.",
    };
  }
  revalidatePath(`/products/${id}`); // Clear cache and trigger new request to the server
  redirect(`/products/${id}`); // Redirect the user back to the /products/${id} page
}

export async function deleteProduct(id: string) {
  try {
    await sql`
    DELETE FROM group3_products
    WHERE id = ${id}`;

  await sql`
  DELETE FROM group3_product_images
  WHERE id = ${id}`;

  await sql `
  DELETE FROM group3_product_images
  WHERE id = ${id}`;
    
  } catch (error) {
    console.error("Database Error: ", error);
    return {
      message: "Database Error: Failed to Delete Product.",
    };
  }
  revalidatePath("/products");
  redirect(`/products`);
}