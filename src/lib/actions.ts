"use server"

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { createUser } from '@/lib/data';
import { DBTableNames, UserData } from '@/types';
 
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

export async function addUser(
  prevState: string | undefined,
  userData: UserData,
) {
  try {
    const data = await createUser(userData);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}