import React from 'react';
import { FoodItem } from '../types';

interface StatsSectionProps {
  foods: FoodItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ foods }) => {
  const avgCalories = Math.round(foods.reduce((s, f) => s + f.calories, 0) / foods.length);
  const avgPrice = (foods.reduce((s, f) => s + f.price, 0) / foods.length).toFixed(1);
  const avgProtein = (foods.reduce((s, f) => s + f.protein, 0) / foods.length).toFixed(1);
  const topValue = [...foods].sort((a, b) => b.valueScore - a.valueScore)[0];
  const topNutrition = [...foods].sort((a, b) => b.nutritionScore - a.nutritionScore)[0];

  const stats = [
    {
      label: '收录餐品',
      value: foods.length.toString(),
      unit: '种',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-[#EFF6FF] text-[#1E40AF]',
    },
    {
      label: '平均热量',
      value: avgCalories.toString(),
      unit: 'kcal',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      color: 'bg-orange-50 text-orange-600',
    },
    {
      label: '平均价格',
      value: `¥${avgPrice}`,
      unit: '/份',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-50 text-green-600',
    },
    {
      label: '平均蛋白质',
      value: avgProtein,
      unit: 'g/份',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-[#1E3A8A]">
              {stat.value}<span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#FCD34D]/10 border border-[#F59E0B]/20 rounded-xl p-5">
          <p className="text-xs font-medium text-[#D97706] mb-1">性价比之王</p>
          <p className="text-lg font-bold text-[#1E3A8A]">{topValue?.name}</p>
          <p className="text-sm text-gray-500">{topValue?.canteen} · ¥{topValue?.price} · {topValue?.valueScore.toFixed(0)} kcal/元</p>
        </div>
        <div className="bg-gradient-to-r from-[#1E40AF]/10 to-[#3B82F6]/10 border border-[#1E40AF]/20 rounded-xl p-5">
          <p className="text-xs font-medium text-[#1E40AF] mb-1">营养评分最高</p>
          <p className="text-lg font-bold text-[#1E3A8A]">{topNutrition?.name}</p>
          <p className="text-sm text-gray-500">{topNutrition?.canteen} · 营养评分 {topNutrition?.nutritionScore}/100</p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
