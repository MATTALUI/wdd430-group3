"use server"

import { signIn } from '@/auth';
import { sql } from '@vercel/postgres';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from "zod";
 
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
  product_id: z.string(),
  src: z.string(),
})
const FormSchema = z.object({
  id: z.string(),
  seller_id: z.string(),
  name: z.string(),
  price: z.coerce
      .number()
      .gt(0, { message: "The price must be greater than $0." }),
  description: z.string(),
  images: z.array(ImagesSchema)
});

const CreateProduct = FormSchema.omit( { id: true, images: true });


export async function createProduct(formData: FormData) {
  
  const { seller_id, name, price, description } = CreateProduct.parse({
    seller_id: formData.get("seller_id"),
    name: formData.get("name"),
    price: formData.get("price"),
    description: formData.get("description"),
  });
  const priceInCents = price * 100;

  //Insert data into the DB:
  try {
    await sql`
      INSERT INTO group3_products (seller_id, name, price, description)
      VALUES (${seller_id}, ${name}, ${priceInCents}, ${description});
    `;
  } catch(error) {
    return { message: "Database Error: Failed to Create New Product" }
  }
    revalidatePath('/products/'); // Clear cache and trigger new request to the server
    redirect('/products'); // Redirect the user back to the /products page
}