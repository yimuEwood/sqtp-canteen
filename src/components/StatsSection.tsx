import React from 'react';
import { FoodItem } from '../types';

interface StatsSectionProps {
  foods: FoodItem[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ foods }) => {
  if (foods.length === 0) return null;

  const avgCalories = Math.round(foods.reduce((s, f) => s + f.calories, 0) / foods.length);
  const avgPrice = (foods.reduce((s, f) => s + f.price, 0) / foods.length).toFixed(1);
  const avgProtein = (foods.reduce((s, f) => s + f.protein, 0) / foods.length).toFixed(1);

  // 按性价比和营养评分排序
  const sortedByValue = [...foods].sort((a, b) => b.valueScore - a.valueScore);
  const topValue = sortedByValue[0];
  const topNutrition = [...foods].sort((a, b) => b.nutritionScore - a.nutritionScore)[0];

  // 统计覆盖食堂数量和分类数量
  const canteenCount = new Set(foods.map(f => f.canteen)).size;
  const categoryCount = new Set(foods.map(f => f.category)).size;

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
      unit: 'kcal/份',
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
    <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
      {/* Section header */}
      <div className="text-center mb-12">
        <span className="inline-block bg-[#EFF6FF] text-[#1E40AF] text-xs font-semibold px-3 py-1 rounded-full mb-3">数据概览</span>
        <h2 className="text-2xl font-bold text-[#1E3A8A]">核心指标</h2>
        <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">基于已收录餐品的统计分析</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="group bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-default">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-[#1E3A8A] tabular-nums">
              {stat.value}<span className="text-sm font-normal text-gray-400 ml-1">{stat.unit}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Highlight cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="group bg-gradient-to-r from-[#F59E0B]/8 to-[#FCD34D]/8 border border-[#F59E0B]/15 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#D97706] uppercase tracking-wider">性价比最优餐品</p>
              <p className="text-lg font-bold text-[#1E3A8A] mt-1">{topValue?.name || '-'}</p>
              <p className="text-sm text-gray-500 mt-0.5">{topValue?.canteen ?? '-'} · ¥{topValue?.price?.toFixed(1)} · {topValue?.valueScore?.toFixed(0) || '-'} kcal/元</p>
            </div>
          </div>
        </div>
        <div className="group bg-gradient-to-r from-[#1E40AF]/8 to-[#3B82F6]/8 border border-[#1E40AF]/15 rounded-xl p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#1E40AF]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1E40AF] uppercase tracking-wider">营养评分最高</p>
              <p className="text-lg font-bold text-[#1E3A8A] mt-1">{topNutrition?.name || '-'}</p>
              <p className="text-sm text-gray-500 mt-0.5">{topNutrition?.canteen ?? '-'} · 营养评分 {topNutrition?.nutritionScore?.toFixed(0) || '-'}/100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage info */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          覆盖 {canteenCount} 个食堂
        </span>
        <span className="w-1 h-1 rounded-full bg-gray-200" />
        <span>{categoryCount} 个餐品分类</span>
        <span className="w-1 h-1 rounded-full bg-gray-200" />
        <span>数据持续更新中</span>
      </div>
    </section>
  );
};

export default StatsSection;
