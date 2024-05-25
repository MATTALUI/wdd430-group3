"use client"

import { Review } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

interface IRatingStarsProps {
  defaultValue?: number;
  readonly?: boolean;
  onChange?: (val: Review["stars"]) => void;
}

const MIN_STARS = 1;
const MAX_STARS = 5;

export default function RatingStars({
  defaultValue,
  readonly,
}: IRatingStarsProps) {
  const [rating, setRating] = useState(defaultValue || 0);

  const resetRating = useCallback(() => {
    if (readonly) return;
    setRating(defaultValue || 0)
  }, [defaultValue, setRating, readonly]);

  const enterHandlers = useMemo(() => {
    return new Array(MAX_STARS)
      .fill(null)
      .map((_, i) => i)
      .reduce((handlers: Record<number, () => void>, index) => {
        handlers[index] = () => {
          if (readonly) return;
          setRating(index + 1);
        }
        return handlers;
      }, {});
  }, [setRating, readonly]);

  const stars = useMemo(() => {
    return new Array(MAX_STARS).fill(null).map((_, i) => (
      i <= rating - 1 ? FaStar : FaRegStar
    ));
  }, [rating]);

  return (
    <div className="flex mb-4">
      {stars.map((Star, index) => (
        <span
          key={index}
          onMouseEnter={enterHandlers[index]}
          onMouseLeave={resetRating}
        >
          <Star />
        </span>
      ))}
    </div>
  );
}