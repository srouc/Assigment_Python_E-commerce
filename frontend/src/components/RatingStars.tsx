import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number | string;
  max?: number;
  size?: number;
  showScore?: boolean;
  reviewsCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  size = 16,
  showScore = true,
  reviewsCount,
}) => {
  const numRating = Number(rating) || 0;

  return (
    <div className="flex items-center gap-1.5 text-amber-500">
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${
              i < Math.floor(numRating)
                ? 'fill-amber-400 text-amber-400'
                : i < numRating
                ? 'fill-amber-200 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      {showScore && <span className="text-xs font-semibold text-slate-700">{numRating.toFixed(1)}</span>}
      {reviewsCount !== undefined && (
        <span className="text-xs text-slate-400">({reviewsCount})</span>
      )}
    </div>
  );
};

