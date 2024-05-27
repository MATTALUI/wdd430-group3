"use client"

import { Product, Review } from "@/types";
import { useCallback, useMemo, useRef, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

interface IRatingStarsProps {
  defaultValue?: number;
  readonly?: boolean;
  onChange?: (v: Review["stars"]) => void;
}

const MIN_STARS = 1;
const MAX_STARS = 5;

export default function RatingStars({
  defaultValue,
  readonly,
  onChange,
}: IRatingStarsProps) {
  const explicitRating = useRef(0);
  const [rating, setRating] = useState(defaultValue || 0);

  const resetRating = useCallback(() => {
    if (readonly) return;
    setRating(explicitRating.current || defaultValue || 0);
  }, [defaultValue, setRating, readonly, explicitRating]);

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

  const clickHandlers = useMemo(() => {
    return new Array(MAX_STARS)
      .fill(null)
      .map((_, i) => i)
      .reduce((handlers: Record<number, (e: React.MouseEvent) => void>, index) => {
        handlers[index] = (e) => {
          if (readonly || !onChange) return;
          e.preventDefault();
          const newRating = index + 1 as Review["stars"];
          explicitRating.current = newRating;
          setRating(newRating);
          onChange(newRating);
        }
        return handlers;
      }, {});
  }, [setRating, readonly, onChange, explicitRating]);

  const stars = useMemo(() => {
    return new Array(MAX_STARS).fill(null).map((_, i) => (
      i <= rating - 1 ? FaStar : FaRegStar
    ));
  }, [rating]);

  const stopProp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  return (
    <div className="flex mb-4" onClick={stopProp}>
      {stars.map((Star, index) => (
        <span
          key={index}
          onMouseEnter={enterHandlers[index]}
          onClick={clickHandlers[index]}
          onMouseLeave={resetRating}
        >
          <Star />
        </span>
      ))}
    </div>
  );
}