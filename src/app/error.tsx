'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-full flex-col items-center justify-center">
        <h1 className="text-5xl">500</h1>
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="mt-4 rounded-md bg-accent px-4 py-2 text-sm text-white "
        onClick={
          // Attempt to recover by trying to re-render the products route
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}