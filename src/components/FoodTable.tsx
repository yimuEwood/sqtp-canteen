import React, { useState } from 'react';
import { FoodItem } from '../types';
import StarRating from './StarRating';

interface FoodTableProps {
  foods: FoodItem[];
  onEdit: (item: FoodItem) => void;
  onDelete: (id: string) => void;
  canEdit?: boolean;
  onRated?: () => void;
}

type SortKey = keyof FoodItem;

const FoodTable: React.FC<FoodTableProps> = ({ foods, onEdit, onDelete, canEdit = true, onRated }) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(prev => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = [...foods].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (typeof va === 'string' && typeof vb === 'string') {
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    if (typeof va === 'number' && typeof vb === 'number') {
      return sortAsc ? va - vb : vb - va;
    }
    return 0;
  });

  const SortIcon = ({ field }: { field: SortKey }) => (
    <span className={`ml-1 text-xs ${sortKey === field ? 'text-[#1E40AF]' : 'text-gray-300'}`}>
      {sortKey === field ? (sortAsc ? '↑' : '↓') : '↕'}
    </span>
  );

  const getNutritionColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const columns: { key: SortKey; label: string; sortable?: boolean }[] = [
    { key: 'name', label: '餐品名称', sortable: true },
    { key: 'canteen', label: '食堂', sortable: true },
    { key: 'area' as SortKey, label: '分区', sortable: true },
    { key: 'category', label: '分类', sortable: true },
    { key: 'price', label: '价格(¥)', sortable: true },
    { key: 'calories', label: '热量(kcal)', sortable: true },
    { key: 'protein', label: '蛋白质(g)', sortable: true },
    { key: 'fat', label: '脂肪(g)', sortable: true },
    { key: 'carbs', label: '碳水(g)', sortable: true },
    { key: 'nutritionScore', label: '营养评分', sortable: true },
    { key: 'valueScore', label: '性价比', sortable: true },
  ];

  if (foods.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-16 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-400 font-medium">没有符合条件的餐品</p>
        <p className="text-gray-300 text-sm mt-1">尝试调整筛选条件</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-gray-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap ${col.sortable ? 'cursor-pointer hover:text-[#1E40AF] select-none' : ''}`}
                >
                  {col.label}
                  {col.sortable && <SortIcon field={col.key} />}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">操作</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((food, idx) => (
              <React.Fragment key={food.id}>
                <tr
                  className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-150 cursor-pointer ${idx % 2 === 0 ? '' : 'bg-gray-50/30'}`}
                  onClick={() => setExpandedId(expandedId === food.id ? null : food.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${expandedId === food.id ? 'rotate-90' : ''}`}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                      <span className="font-medium text-[#1E3A8A]">{food.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{food.canteen}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${food.area ? 'bg-purple-50 text-purple-600' : 'text-gray-300'}`}>
                      {food.area || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-50 text-[#1E40AF] text-xs px-2 py-0.5 rounded-full">{food.category}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-700">¥{food.price.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-orange-400 h-1.5 rounded-full"
                          style={{ width: `${Math.min(100, (food.calories / 800) * 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-700 tabular-nums">{food.calories}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">{food.protein.toFixed(1)}</td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">{food.fat.toFixed(1)}</td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">{food.carbs.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getNutritionColor(food.nutritionScore)}`}>
                      {food.nutritionScore}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 tabular-nums">{food.valueScore.toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      {canEdit && (
                        <button
                          onClick={() => onEdit(food)}
                          className="p-1.5 text-[#3B82F6] hover:bg-blue-50 rounded-lg transition-colors duration-150 cursor-pointer"
                          title="编辑"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => onDelete(food.id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors duration-150 cursor-pointer"
                          title="删除"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedId === food.id && (
                  <tr className="bg-blue-50/40">
                    <td colSpan={12} className="px-8 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400 text-xs">食堂 · 分区</span>
                          <p className="font-medium text-[#1E3A8A]">{food.canteen}{food.area ? ` · ${food.area}` : ''}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs">窗口</span>
                          <p className="font-medium text-[#1E3A8A]">{food.window || '-'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs">重量</span>
                          <p className="font-medium text-[#1E3A8A]">{food.weight}g</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs">膳食纤维</span>
                          <p className="font-medium text-[#1E3A8A]">{food.fiber}g</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs">钠</span>
                          <p className="font-medium text-[#1E3A8A]">{food.sodium}mg</p>
                        </div>
                        {food.notes && (
                          <div className="col-span-2 md:col-span-4">
                            <span className="text-gray-400 text-xs">备注</span>
                            <p className="text-gray-600">{food.notes}</p>
                          </div>
                        )}
                      </div>
                      {/* 评分区域 */}
                      <div className="mt-4 pt-3 border-t border-blue-100/60 flex items-center gap-3">
                        <span className="text-xs text-gray-500">我的评分：</span>
                        <StarRating foodId={food.id} initialRating={0} ratingCount={0} size="md" onRated={onRated} />
                        {(food.avg_rating ?? 0) > 0 && (
                          <span className="text-xs text-gray-400 ml-2">
                            平均 {(food.avg_rating ?? 0).toFixed(1)} 分 · {food.rating_count ?? 0} 人评
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodTable;
