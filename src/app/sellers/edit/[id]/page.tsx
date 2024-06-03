import React from 'react'
import { getUser, updateProfileSchema } from "@/lib/data";
import Link from "next/link";
import { updateProfileFormData } from '@/lib/actions';
import { redirect } from 'next/navigation';

interface ISellersPageProps {
    params: ISellersPageParams;
    searchParams: { errors?: string };
}
interface ISellersPageParams {
    id: string;
}

export default async function EditSeller ({
    params, searchParams
  }: ISellersPageProps) {

    const { id } = params;
    const user = await getUser({ id });
    const errors = searchParams.errors ? JSON.parse(decodeURIComponent(searchParams.errors)) : [];
    
    async function updateProfile(formData: FormData) {
        'use server'
        
        const rawFormData = {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            description: formData.get('description'),
            profileImage: formData.get('profileImage'),
        }

        // Validate the form data using the Zod schema
        const parsedFormData = updateProfileSchema.safeParse(rawFormData);

        if (!parsedFormData.success) {
            const validationErrors = parsedFormData.error.errors.map(error => error.message);
            const query = new URLSearchParams({ errors: encodeURIComponent(JSON.stringify(validationErrors)) }).toString();
            redirect(`/sellers/edit/${id}?${query}`);
            return;
        }

        const res = await updateProfileFormData(id, parsedFormData.data);
        if (res) {
            redirect(`/sellers/${id}?profileUpdated=true`);
        } else {
            redirect(`/sellers/${id}/edit`);  
        } 
    }

    return (
        <div>
            <div className="w-full max-w-xs">
                <form action={updateProfile} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1>Edit Seller</h1>

                    {errors.length > 0 && (
                        <div className="mb-4 text-red-500">
                            {errors.map((error: any, index: any) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}
                    
                    <div className="mb-2">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="FirstName"
                        >
                        First Name
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                            defaultValue={user.firstName}
                            id='firstName'
                            name='firstName'
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="LastName"
                        >
                        Last Name
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                            defaultValue={user.lastName}
                            id='lastName'
                            name='lastName'
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                        Email
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                            defaultValue={user.email}
                            id='email'
                            name='email'
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="Description"
                        >
                        Description
                        </label>
                        <textarea
                            rows={4}
                            cols={50}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                            defaultValue={user.description || ""}
                            id='description'
                            name='description'
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="ProfileImage"
                        >
                        Picture URL
                        </label>
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline has-error:border-rose-500"
                            defaultValue={user.profileImage || ""}
                            id='profileImage'
                            name='profileImage'
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="submit"
                            value="Save"
                            className="bg-accent hover:opacity-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                        />
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