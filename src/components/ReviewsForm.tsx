'use client';

import { useState, useCallback } from "react";
import { processReviewFormData } from "@/lib/actions";
import { useSession } from "next-auth/react";
import { z } from 'zod';
import { Review } from "@/types";
import RatingStars from "./RatingStars";

// Define a Zod schema for the form data
const formDataSchema = z.object({
    stars: z.number({ message: 'Must be an intger' }),
    text: z.string().trim().max(1000, { message: 'Must be less than 1000 characters' }),
});

interface IReviewsFormProps {
    reviewers: string[]
}

export default function ReviewsForm({
    reviewers
}:IReviewsFormProps) {
    const { status, data } = useSession();
    const isLoggedIn = status === "authenticated";
    const userId = data?.user?.id;

    // State variables to store input field values
    const [stars, setStars] = useState("5");
    const [text, setText] = useState("");


    const handleReview = useCallback(async () => {
        if (!text) return;
        const product_id = window.location.pathname.substring(10);

        const reviewer_id = data?.user?.id;

        if (!reviewer_id) throw new Error("Anon user trying to create a review")

        // Prepare form data
        const review = {
            stars: +stars as Review['stars'],
            text,
            product_id,
            reviewer_id,
            created_at: new Date(),
            updated_at: new Date(),
        };
        try {
            formDataSchema.parse(review);
            await processReviewFormData(review);

            window.location.reload();
        } catch (error) {
            if (error instanceof z.ZodError) {
                console.error("Unexpected error:", error.errors.map(err => err.message).join(" "));
            } else {
                console.error("Unexpected error:", error);
            }
        }
    }, [stars, text, formDataSchema]);

    const updateStars = useCallback((rating: Review["stars"]) => {
        setStars(rating.toString())
    }, [setStars]);

    if (reviewers.includes(userId || "")) return null;
    return (
        <div className="w-full max-w-xs">
            {isLoggedIn && <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4">
                <h1 className="text-lg font-bold mb-2">Leave a review</h1>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="stars"
                    >
                        Leave a star review
                    </label>
                    <RatingStars
                        defaultValue={+stars}
                        onChange={updateStars}
                    />
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="text"
                    >Leave a review</label>
                    <textarea name="text" id="text" onChange={(e) => setText(e.target.value)}></textarea>
                    <button
                        className="bg-accent hover:opacity-75 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        onClick={handleReview}
                    >
                        Leave Review
                    </button>
                </div>
            </form>}
        </div>
    )
}