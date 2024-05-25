"use server"

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser, updateUser } from '@/lib/data';
import { mapFormDataToDBUser } from '@/lib/data';

 
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
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error('Failed to process form data');
  }
};

export async function updateFormData (id: string, formData: any)  {
  try {
    console.log('formData->',formData);
    const res = await updateUser(id,formData);
    console.log(res);
    return res;
  } catch (error) {
    console.error('Error processing form data:', error);
    throw new Error('Failed to process form data');
  }
};