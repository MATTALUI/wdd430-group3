"use server"

import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { string, z } from "zod";
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

  // Validate data types with zod:

  const ImagesSchema = z.object({
    id: z.string(),
    url: z.string().url()
  })

const ProductSchema = z.object({
  id: z.string(),
  seller_id: z.string().uuid(),
  name: z.string().min(1, "Product name cannot be empty!"),
  price: z.coerce
      .number()
      .gt(0, { message: "The price must be greater than $0." }),
  description: z.string().min(10, "Description must be at least 10 characters."),
  images: z.string(),
});

const ProductData = ProductSchema.omit( { id: true } );
const ImagesUrls = ImagesSchema.omit( { id: true } );

export async function createProduct(formData: FormData) {

  // Add product to DB:
  const { seller_id, name, price, description, images } = ProductData.parse({
    seller_id: formData.get("seller_id"),
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
    images: formData.get("images")
  });

  console.log("Seller_id: ", seller_id);


    const createdProduct = await sql`
      INSERT INTO group3_products (seller_id, name, price, description)
      VALUES (${seller_id}, ${name}, ${price}, ${description})
      RETURNING *;
    `;

    const [insertedProduct] = createdProduct.rows;
    const pId = insertedProduct.id;
    const imagesUrls = JSON.parse(images);

    imagesUrls.forEach(async (url: string) => {
      await sql`
      INSERT INTO group3_product_images (src, product_id)
      VALUES (${url}, ${pId})
      RETURNING *;
    `;
    });
    console.log("The images have been inserted in the images table."); return;

  revalidatePath('/products/'); // Clear cache and trigger new request to the server
  redirect('/products'); // Redirect the user back to the /products page
}