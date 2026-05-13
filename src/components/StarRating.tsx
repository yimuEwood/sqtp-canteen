import React, { useState } from 'react';
import { pb } from '../lib/pocketbase';

interface StarRatingProps {
  foodId: string;
  initialRating?: number;
  ratingCount?: number;
  size?: 'sm' | 'md' | 'lg';
  onRated?: () => void;
}

const StarRating: React.FC<StarRatingProps> = ({ foodId, initialRating = 0, ratingCount = 0, size = 'sm', onRated }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(initialRating);
  const [submitting, setSubmitting] = useState(false);

  const sizeClass = size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const labelSize = size === 'lg' ? 'text-sm' : size === 'md' ? 'text-xs' : 'text-[11px]';

  const handleRate = async (score: number) => {
    const user = pb.authStore.model;
    if (!user) {
      alert('请先登录后再评分');
      return;
    }
    setSubmitting(true);
    try {
      await pb.collection('ratings').create({
        food_id: Number(foodId),
        score,
      });
      setSelected(score);
      if (onRated) onRated();
    } catch (e: any) {
      alert('评分失败：' + (e.message || ''));
    }
    setSubmitting(false);
  };

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={submitting}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`${sizeClass} transition-transform duration-150 cursor-pointer disabled:cursor-wait hover:scale-110 ${hovered >= star || selected >= star ? 'text-[#F59E0B]' : 'text-gray-200'}`}
          title={`${star}星`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
      {ratingCount > 0 && (
        <span className={`text-gray-400 ${labelSize} ml-1`}>
          {selected.toFixed(1)} ({ratingCount})
        </span>
      )}
      {ratingCount === 0 && selected > 0 && (
        <span className={`text-gray-400 ${labelSize} ml-1`}>
          {selected.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
