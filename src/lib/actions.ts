"use server"

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { db } from '@/lib/data';
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

export async function createUser(userData: UserData) {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Save user to the database
    const result = await db()
      .insertInto(DBTableNames.Users)
      .values({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password_hash: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning(['id', 'first_name', 'last_name', 'email'])
      .executeTakeFirstOrThrow();

    const user = {
      id: result.id.toString(),
      firstName: result.first_name,
      lastName: result.last_name,
      email: result.email,
    };

    return { message: 'User created successfully', user };
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

export async function addUser(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const userData: UserData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const data = await createUser(userData);
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}