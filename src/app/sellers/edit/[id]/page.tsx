import React from 'react'
import { getUser } from "@/lib/data";
import Link from "next/link";
import { updateFormData } from '@/lib/actions';
import { redirect } from 'next/navigation';



interface ISellersPageProps {
    params: ISellersPageParams;
}
interface ISellersPageParams {
    id: string;
}

export default async function EditSeller ({
    params,
  }: ISellersPageProps) {

    const { id } = params;
    const user = await getUser({ id });
    
    async function updateUser(formData: FormData) {
        'use server'

        const rawFormData = {
            email: formData.get('email'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            description: formData.get('description'),
        }

        const res = await updateFormData(id, rawFormData);
        redirect(`/sellers/${id}`);       
    }

    return (
        <div>
            <div className="w-full max-w-xs">
                <form action={updateUser} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1>Edit Seller</h1>
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
                    <div className="flex items-center justify-between">
                        <input
                            type="submit"
                            value="Save"
                            className="bg-accent text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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