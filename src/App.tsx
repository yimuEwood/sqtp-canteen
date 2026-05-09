import React, { useState, useMemo, useEffect } from 'react';
import { FoodItem, FilterState } from './types';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FoodTable from './components/FoodTable';
import FoodEditModal from './components/FoodEditModal';
import ChartsSection from './components/ChartsSection';
import Footer from './components/Footer';

type Page = 'home' | 'data' | 'charts' | 'about';

const CATEGORIES = ['荤菜盖饭', '素菜', '荤菜', '面食', '蛋类', '汤类/火锅', '豆制品', '凉菜'];
const CANTEENS = ['第一食堂', '第二食堂', '第三食堂'];

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    category: '',
    canteen: '',
    maxPrice: 30,
    minCalories: 0,
    maxCalories: 1000,
    searchQuery: '',
  });

  // 从 Supabase 加载数据
  useEffect(() => {
    const loadFoods = async () => {
      const { data, error } = await supabase.from('foods').select('*').order('id');
      if (error) {
        console.error('加载数据失败:', error);
      } else if (data) {
        setFoods(data as FoodItem[]);
      }
      setLoading(false);
    };
    loadFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter(f => {
      if (filter.category && f.category !== filter.category) return false;
      if (filter.canteen && f.canteen !== filter.canteen) return false;
      if (f.price > filter.maxPrice) return false;
      if (f.calories < filter.minCalories || f.calories > filter.maxCalories) return false;
      if (filter.searchQuery && !f.name.toLowerCase().includes(filter.searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [foods, filter]);

  const handleSave = async (item: FoodItem) => {
    if (isAdding) {
      const { data, error } = await supabase.from('foods').insert([{
        id: item.id ? Number(item.id) : Date.now(),
        name: item.name,
        category: item.category,
        canteen: item.canteen,
        price: item.price,
        calories: item.calories,
        protein: item.protein,
        fat: item.fat,
        carbs: item.carbs,
        fiber: item.fiber,
        sodium: item.sodium,
        nutritionScore: item.nutritionScore,
        valueScore: item.valueScore,
      }]).select();
      if (error) {
        console.error('添加失败:', error);
        alert('添加失败，请重试');
        return;
      }
      if (data) setFoods(prev => [...prev, ...data as FoodItem[]]);
      setIsAdding(false);
      setEditingItem(null);
    } else {
      const { error } = await supabase.from('foods').update({
        name: item.name,
        category: item.category,
        canteen: item.canteen,
        price: item.price,
        calories: item.calories,
        protein: item.protein,
        fat: item.fat,
        carbs: item.carbs,
        fiber: item.fiber,
        sodium: item.sodium,
        nutritionScore: item.nutritionScore,
        valueScore: item.valueScore,
      }).eq('id', Number(item.id));
      if (error) {
        console.error('更新失败:', error);
        alert('更新失败，请重试');
        return;
      }
      setFoods(prev => prev.map(f => f.id === item.id ? item : f));
      setEditingItem(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确认删除该餐品记录？')) return;
    const { error } = await supabase.from('foods').delete().eq('id', Number(id));
    if (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
      return;
    }
    setFoods(prev => prev.filter(f => f.id !== id));
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingItem({
      id: '',
      name: '',
      category: CATEGORIES[0],
      canteen: CANTEENS[0],
      window: '',
      price: 0,
      weight: 0,
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
      fiber: 0,
      sodium: 0,
      valueScore: 0,
      nutritionScore: 0,
      notes: '',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-[#1E40AF] text-lg font-medium">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar page={page} setPage={setPage} />

      {page === 'home' && (
        <>
          <HeroSection setPage={setPage} />
          <StatsSection foods={foods} />
          <ChartsSection foods={foods} />
        </>
      )}

      {page === 'data' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1E3A8A]">餐品数据库</h1>
              <p className="text-gray-500 mt-1">共收录 <span className="text-[#1E40AF] font-semibold">{foods.length}</span> 种餐品，筛选后显示 <span className="text-[#F59E0B] font-semibold">{filteredFoods.length}</span> 种</p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加餐品
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">搜索餐品</label>
                <input
                  type="text"
                  placeholder="输入餐品名称..."
                  value={filter.searchQuery}
                  onChange={e => setFilter(f => ({ ...f, searchQuery: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">分类</label>
                <select
                  value={filter.category}
                  onChange={e => setFilter(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                >
                  <option value="">全部分类</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">食堂</label>
                <select
                  value={filter.canteen}
                  onChange={e => setFilter(f => ({ ...f, canteen: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                >
                  <option value="">全部食堂</option>
                  {CANTEENS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">价格上限: ¥{filter.maxPrice}</label>
                <input
                  type="range"
                  min={2} max={30} step={0.5}
                  value={filter.maxPrice}
                  onChange={e => setFilter(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                  className="w-full accent-[#1E40AF] cursor-pointer"
                />
              </div>
            </div>
          </div>

          <FoodTable
            foods={filteredFoods}
            onEdit={(item) => setEditingItem(item)}
            onDelete={handleDelete}
          />
        </div>
      )}

      {page === 'charts' && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#1E3A8A] mb-6">数据可视化</h1>
          <ChartsSection foods={foods} fullPage />
        </div>
      )}

      {page === 'about' && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <AboutPage />
        </div>
      )}

      <Footer />

      {(editingItem || isAdding) && (
        <FoodEditModal
          item={editingItem!}
          isNew={isAdding}
          onSave={handleSave}
          onClose={() => { setEditingItem(null); setIsAdding(false); }}
        />
      )}
    </div>
  );
};

const AboutPage: React.FC = () => (
  <div className="space-y-10">
    <div>
      <span className="inline-block bg-[#EFF6FF] text-[#1E40AF] text-xs font-semibold px-3 py-1 rounded-full mb-3">关于项目</span>
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">SQTP 食堂营养数据项目</h1>
      <p className="text-gray-600 leading-relaxed text-lg">
        本项目隶属于浙江大学学生科研训练计划（SQTP），旨在通过系统性拆解与测算学校食堂餐品的营养成分、热量、价格与性价比数据，为同学们提供科学、透明的餐饮参考。
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: '🔬', title: '科学测算', desc: '采用食物成分数据库与实测相结合的方式，系统估算每道餐品的宏量营养素含量。' },
        { icon: '📊', title: '数据公开', desc: '所有数据在本平台完整公开，支持筛选、比较、导出，促进食堂餐饮信息透明化。' },
        { icon: '💡', title: '理性选餐', desc: '基于热量密度、蛋白质比例、性价比等多维度评分，帮助同学做出更健康的饮食选择。' },
      ].map(item => (
        <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="text-3xl mb-3">{item.icon}</div>
          <h3 className="font-semibold text-[#1E3A8A] text-lg mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>

    <div className="bg-[#EFF6FF] rounded-xl p-8">
      <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">研究方法说明</h2>
      <ul className="space-y-3 text-gray-600">
        <li className="flex gap-3"><span className="text-[#1E40AF] font-bold flex-shrink-0">01.</span>现场采集食堂餐品实物，使用电子秤称量并分类记录各组分重量</li>
        <li className="flex gap-3"><span className="text-[#1E40AF] font-bold flex-shrink-0">02.</span>参照中国食物成分表（第6版）查询各食材的营养素含量数据</li>
        <li className="flex gap-3"><span className="text-[#1E40AF] font-bold flex-shrink-0">03.</span>根据各组分比例计算整份餐品的热量、蛋白质、脂肪、碳水化合物等指标</li>
        <li className="flex gap-3"><span className="text-[#1E40AF] font-bold flex-shrink-0">04.</span>结合餐品售价计算热量/价格比（性价比）和综合营养评分</li>
      </ul>
    </div>

    <div>
      <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">项目成员</h2>
      <div className="flex flex-wrap gap-3">
        {['杨潘（负责人）', '数据采集团队', '营养分析团队'].map(m => (
          <span key={m} className="bg-white border border-[#BFDBFE] text-[#1E40AF] px-4 py-2 rounded-full text-sm font-medium">{m}</span>
        ))}
      </div>
    </div>
  </div>
);

export default App;
