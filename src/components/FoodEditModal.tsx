import React, { useState } from 'react';
import { FoodItem } from '../types';
import { categories, canteens } from '../data';

interface FoodEditModalProps {
  item: FoodItem;
  isNew: boolean;
  onSave: (item: FoodItem) => void;
  onClose: () => void;
}

const Field: React.FC<{
  label: string;
  name: keyof FoodItem;
  value: string | number;
  type?: string;
  onChange: (name: keyof FoodItem, value: string | number) => void;
  step?: string;
}> = ({ label, name, value, type = 'text', onChange, step }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type={type}
      step={step}
      value={value}
      onChange={e => onChange(name, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
    />
  </div>
);

const FoodEditModal: React.FC<FoodEditModalProps> = ({ item, isNew, onSave, onClose }) => {
  const [form, setForm] = useState<FoodItem>({ ...item });

  const handleChange = (name: keyof FoodItem, value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-[#1E3A8A]">{isNew ? '添加新餐品' : `编辑：${item.name}`}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic info */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E40AF] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#EFF6FF] rounded flex items-center justify-center text-xs">1</span>
              基本信息
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="餐品名称 *" name="name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">分类</label>
                <select
                  value={form.category}
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">食堂</label>
                <select
                  value={form.canteen}
                  onChange={e => setForm(prev => ({ ...prev, canteen: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                >
                  {canteens.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="其他食堂">其他食堂</option>
                </select>
              </div>
              <Field label="窗口" name="window" value={form.window} onChange={handleChange} />
              <Field label="价格 (¥)" name="price" value={form.price} type="number" step="0.5" onChange={handleChange} />
              <Field label="重量 (g)" name="weight" value={form.weight} type="number" step="5" onChange={handleChange} />
            </div>
          </div>

          {/* Nutrition */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E40AF] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#EFF6FF] rounded flex items-center justify-center text-xs">2</span>
              营养成分
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="热量 (kcal)" name="calories" value={form.calories} type="number" onChange={handleChange} />
              <Field label="蛋白质 (g)" name="protein" value={form.protein} type="number" step="0.1" onChange={handleChange} />
              <Field label="脂肪 (g)" name="fat" value={form.fat} type="number" step="0.1" onChange={handleChange} />
              <Field label="碳水化合物 (g)" name="carbs" value={form.carbs} type="number" step="0.1" onChange={handleChange} />
              <Field label="膳食纤维 (g)" name="fiber" value={form.fiber} type="number" step="0.1" onChange={handleChange} />
              <Field label="钠 (mg)" name="sodium" value={form.sodium} type="number" onChange={handleChange} />
            </div>
          </div>

          {/* Scores */}
          <div>
            <h3 className="text-sm font-semibold text-[#1E40AF] mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-[#EFF6FF] rounded flex items-center justify-center text-xs">3</span>
              评分指标
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">性价比 (kcal/元)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.valueScore}
                  onChange={e => setForm(prev => ({ ...prev, valueScore: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, valueScore: prev.price > 0 ? parseFloat((prev.calories / prev.price).toFixed(1)) : 0 }))}
                  className="mt-1 text-xs text-[#3B82F6] hover:underline cursor-pointer"
                >
                  自动计算
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">营养评分 (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.nutritionScore}
                  onChange={e => setForm(prev => ({ ...prev, nutritionScore: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">备注说明</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] resize-none"
              placeholder="可填写测算说明、食材组成等..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-colors duration-150 cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-4 py-2.5 rounded-xl font-medium transition-colors duration-150 cursor-pointer"
            >
              {isNew ? '添加' : '保存修改'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodEditModal;
