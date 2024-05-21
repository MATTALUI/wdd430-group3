"use client"

import Link from "next/link";
import { useState, useCallback } from "react";
import { processFormData } from "@/lib/actions";
import { z } from 'zod';
//import { useRouter } from 'next/router';

export default function SignupPage() {
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  //const router = useRouter();

  // State variables to store input field values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  // Define a Zod schema for the form data
  const formDataSchema = z.object({
    firstName: z.string().trim().min(3, { message: "First name must be 3 or more characters long" }),
    lastName: z.string().trim().min(3, { message: "Last name must be 3 or more characters long" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().trim().min(8, { message: "Password must be 8 or more characters long" }),
    repeatPassword: z.string().trim().min(8, { message: "Repeat password must be 8 or more characters long" }),
  }).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match!",
    path: ["repeatPassword"], 
  });

  const handleSignUp = useCallback(async () => {
    // Prepare form data
    const formData = {
      firstName,
      lastName,
      email,
      password,
      repeatPassword,
    };
    //const router = useRouter();
    //console.log(router.pathname);
    // Validate the form data using the Zod schema
    try {
      formDataSchema.parse(formData);

      const data = await processFormData(formData);

      if (data.error) {
        setSuccessMessage('');
        setError('Email is already registered!');
      } else {
        setError('');
        setSuccessMessage('User created successfully');
        //setTimeout(() => router.push('/login'), 2000);
      }
        
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors.map(err => err.message).join(" "));
      } else {
        console.error("Unexpected error:", error);
        setError('Failed to create user. Please try again later.');
      }
    }
  }, [firstName, lastName, email, password, repeatPassword, formDataSchema]);

  return (
    <div>
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-lg font-bold mb-2">Create Account</h1>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="FirstName"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="LastName"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="Email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-0 leading-tight focus:outline-none focus:shadow-outline" 
              id="password" 
              type="password" 
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="repeatPassword">
              Repeat Password
            </label>
            <input 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-0 leading-tight focus:outline-none focus:shadow-outline" 
              id="repeatPassword" 
              type="password" 
              placeholder="********"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
          {error && <div style={{ color: 'red' }}>{error}</div>}
          <div style={{ color: 'green' }}>{successMessage}</div>
          <div className="flex items-center justify-between">
            <button 
              className="bg-accent hover:opacity-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-secondary"
              href="/login"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}