'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { updateProfileFormData } from '@/lib/actions';
import { z } from 'zod';

const UserProfileClient = ({ user }: { user: User }) => {
  const router = useRouter();
  
  const initialFormData = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    description: user.description || '',
    profileImage: user.profileImage || ''
  };

  const [formData, setFormData] = useState(initialFormData);

  // Define a Zod schema for the form data
  const formDataSchema = z.object({
    firstName: z.string().trim().min(3, { message: "First name must be 3 or more characters long" }),
    lastName: z.string().trim().min(3, { message: "Last name must be 3 or more characters long" }),
    email: z.string().email({ message: "Invalid email format" }),
    description: z.string().optional(),
    profileImage: z.string().optional(),
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const isFormDataChanged = JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const handleSignUp = useCallback(async () => {
    try {
      const res = formDataSchema.parse(formData);
      const data = await updateProfileFormData(user.id, formData);
      setSuccess('Seller updated successfully');
      router.push(`/sellers/${user.id}?profileUpdated=true`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map(err => err.message).join(" "));
      } else {
        console.error("Unexpected error:", error);
        setError('Failed to create user. Please try again later.');
      }
    }
  }, [formData, formDataSchema, router, user.id]);

  return (
    <div>
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-lg font-bold mb-2">Update Profile</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="firstName"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lastName"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="profileImage"
            >
              Profile Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="profileImage"
              type="text"
              placeholder="Profile Image"
              value={formData.profileImage}
              onChange={handleInputChange}
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div className="flex items-center justify-between">
            <button
                className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    isFormDataChanged ? 'bg-accent hover:opacity-75 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                }`} 
                type="button"
                onClick={handleSignUp}
                disabled={!isFormDataChanged}
            >
              Save
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-secondary"
              href={`/sellers/${user.id}`}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfileClient;
