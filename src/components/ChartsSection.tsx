import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { FoodItem } from '../types';

interface ChartsSectionProps {
  foods: FoodItem[];
  fullPage?: boolean;
}

const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#F59E0B', '#FCD34D', '#6D28D9', '#A78BFA', '#059669', '#34D399'];

const ChartsSection: React.FC<ChartsSectionProps> = ({ foods, fullPage }) => {
  // 1. Calories bar chart by category
  const caloriesByCategory = Object.entries(
    foods.reduce((acc, f) => {
      if (!acc[f.category]) acc[f.category] = { total: 0, count: 0 };
      acc[f.category].total += f.calories;
      acc[f.category].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>)
  ).map(([name, { total, count }]) => ({ name, avg: Math.round(total / count) }));

  // 2. Price vs Calories scatter
  const scatterData = foods.map(f => ({ name: f.name, price: f.price, calories: f.calories }));

  // 3. Nutrition radar for top 5 by nutrition score
  const top5 = [...foods].sort((a, b) => b.nutritionScore - a.nutritionScore).slice(0, 5);

  // 4. Category distribution pie
  const categoryDist = Object.entries(
    foods.reduce((acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  // 5. Top 8 value score
  const topValue = [...foods].sort((a, b) => b.valueScore - a.valueScore).slice(0, 8);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-xs">
          <p className="font-semibold text-[#1E3A8A] mb-1">{label || payload[0]?.payload?.name}</p>
          {payload.map((p: any) => (
            <p key={p.name} style={{ color: p.color }}>
              {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className={fullPage ? '' : 'max-w-7xl mx-auto px-4 pb-12'}>
      {!fullPage && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-[#1E3A8A]">数据概览</h2>
          <p className="text-gray-500 text-sm mt-1">基于已收录 {foods.length} 种餐品的统计分析</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Avg calories by category */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">各类别平均热量 (kcal)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={caloriesByCategory} margin={{ left: 0, right: 10, top: 5, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avg" name="平均热量" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Category distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">餐品类别分布</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryDist}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={85}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryDist.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Value score top 8 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">性价比排行 Top 8 (kcal/元)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topValue} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valueScore" name="性价比" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 4: Price vs Calories scatter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">价格 vs 热量分布</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="price" name="价格" unit="¥" tick={{ fontSize: 10, fill: '#64748B' }} label={{ value: '价格(¥)', position: 'insideBottom', offset: -2, fontSize: 10 }} />
              <YAxis dataKey="calories" name="热量" unit="kcal" tick={{ fontSize: 10, fill: '#64748B' }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-xs">
                      <p className="font-semibold text-[#1E3A8A]">{d.name}</p>
                      <p className="text-gray-600">价格: ¥{d.price} · 热量: {d.calories}kcal</p>
                    </div>
                  );
                }
                return null;
              }} />
              <Scatter data={scatterData} fill="#1E40AF" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 5: Macros breakdown (only in full page) */}
        {fullPage && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">各餐品宏量营养素对比 (g)</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={foods.slice(0, 10).map(f => ({ name: f.name, 蛋白质: f.protein, 脂肪: f.fat, 碳水: f.carbs }))}
                margin={{ left: 0, right: 10, top: 5, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} angle={-30} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="蛋白质" fill="#1E40AF" radius={[2, 2, 0, 0]} />
                <Bar dataKey="脂肪" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                <Bar dataKey="碳水" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Chart 6: Nutrition score distribution */}
        {fullPage && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">营养评分分布</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={[
                  { range: '0-40', count: foods.filter(f => f.nutritionScore < 40).length },
                  { range: '40-60', count: foods.filter(f => f.nutritionScore >= 40 && f.nutritionScore < 60).length },
                  { range: '60-80', count: foods.filter(f => f.nutritionScore >= 60 && f.nutritionScore < 80).length },
                  { range: '80-100', count: foods.filter(f => f.nutritionScore >= 80).length },
                ]}
                margin={{ left: 0, right: 10, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="餐品数" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {fullPage && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-[#1E3A8A] mb-4">营养素雷达图 (前5名)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={[
                { subject: '热量', value: top5.reduce((s, f) => s + f.calories, 0) / top5.length / 10 },
                { subject: '蛋白质', value: top5.reduce((s, f) => s + f.protein, 0) / top5.length * 3 },
                { subject: '脂肪控制', value: 100 - top5.reduce((s, f) => s + f.fat, 0) / top5.length * 3 },
                { subject: '碳水', value: top5.reduce((s, f) => s + f.carbs, 0) / top5.length },
                { subject: '纤维', value: top5.reduce((s, f) => s + f.fiber, 0) / top5.length * 15 },
                { subject: '低钠', value: 100 - top5.reduce((s, f) => s + f.sodium, 0) / top5.length / 10 },
              ]}>
                <PolarGrid stroke="#E2E8F0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748B' }} />
                <Radar name="Top5营养餐" dataKey="value" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChartsSection;
