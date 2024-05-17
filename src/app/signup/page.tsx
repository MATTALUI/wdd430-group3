"use client"

import Link from "next/link";
import { useState } from "react";
import { addUser } from "@/lib/actions";
import { useRouter } from 'next/router';

const useClient = () => {};


export default function SignupPage() {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State variables to store input field values
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const isValidEmail = (email: string) => {
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Event handler for the "Sign Up" button click
  const handleSignUp = () => {
    // Check if the first name is empty
    if (!firstName.trim()) {
      setError('First Name cannot be empty!');
      return;
    }

    if (!email.trim()) {
      setError('Email cannot be empty!');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!password.trim()) {
      setError('Password cannot be empty!');
      return;
    }

    // Password validation
    if (password !== repeatPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("password", password);
    
    // Call the addUser function
    addUser(undefined, formData)
      .then((response) => {
        if (response.error) {
          console.error("Error creating user:", response.error);
          setError('Email is already registered!');
        } else {
          console.log("User created successfully:", response.message);
          setSuccessMessage('User created successfully');

          // Redirect to the login page
        }
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        setError('Failed to create user. Please try again later.');
    });
  };

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