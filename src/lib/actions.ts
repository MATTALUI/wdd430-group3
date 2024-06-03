"use server"

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, createReview, updateUser } from '@/lib/data'; // Update import statements
import { mapFormDataToDBUser, mapFormDataToDBReview } from '@/lib/data';
import { DBReview } from '@/types';

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

export async function processFormData (formData: any)  {
  try {
    const dbUser = await mapFormDataToDBUser(formData);
    const data = await createUser(dbUser);
    return data;
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error('Failed to process form data');
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

export async function processReviewFormData(review: Omit<DBReview, 'id'>) {
  try {
    await createReview(review);
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error('Failed to process form data');
  }
}