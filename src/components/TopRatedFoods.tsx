import React from 'react';
import { FoodItem } from '../types';

interface TopRatedFoodsProps {
  foods: FoodItem[];
  onViewData: () => void;
}

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(star => (
      <svg key={star} className={`w-3.5 h-3.5 ${star <= rating ? 'text-[#F59E0B]' : 'text-gray-200'}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
    <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
  </div>
);

const TopRatedFoods: React.FC<TopRatedFoodsProps> = ({ foods, onViewData }) => {
  const medalColors = ['text-[#F59E0B]', 'text-gray-400', 'text-[#CD7F32]'];
  const medalIcons = ['🥇', '🥈', '🥉'];

  // 过滤出有评分的并按评分排序
  const rated = foods
    .filter(f => (f.avg_rating ?? 0) > 0)
    .sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0))
    .slice(0, 8);

  if (rated.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-8">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F59E0B]/10 via-[#FCD34D]/10 to-[#FBBF24]/10 px-6 py-5 border-b border-[#F59E0B]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F59E0B]/15 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-[#D97706]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1E3A8A]">🍽️ 口味天梯榜</h2>
                <p className="text-xs text-gray-500 mt-0.5">根据用户评分排名，点击星星为餐品打分</p>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50">
          {rated.map((food, idx) => (
            <div key={food.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-yellow-50/40 transition-colors duration-150">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 text-center">
                {idx < 3 ? (
                  <span className="text-lg">{medalIcons[idx]}</span>
                ) : (
                  <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1E3A8A] truncate">{food.name}</p>
                <p className="text-xs text-gray-400 truncate">{food.canteen}{food.area ? ` · ${food.area}` : ''}</p>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0 flex items-center gap-3">
                <StarDisplay rating={food.avg_rating ?? 0} />
                <span className="text-xs text-gray-400">{food.rating_count}人评</span>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right w-16">
                <p className="text-sm font-medium text-gray-700">¥{food.price.toFixed(1)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-gray-50/50 border-t border-gray-50">
          <button
            onClick={onViewData}
            className="text-xs text-[#1E40AF] hover:text-[#1E3A8A] font-medium cursor-pointer transition-colors"
          >
            查看全部餐品 →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopRatedFoods;
