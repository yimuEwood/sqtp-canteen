import React, { useState, useMemo, useEffect } from 'react';
import { FoodItem, FilterState, FoodProposal } from './types';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FoodTable from './components/FoodTable';
import FoodEditModal from './components/FoodEditModal';
import ChartsSection from './components/ChartsSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';

type Page = 'home' | 'data' | 'charts' | 'about' | 'admin';

const CATEGORIES = ['荤菜盖饭', '素菜', '荤菜', '面食', '蛋类', '汤类/火锅', '豆制品', '凉菜'];

// 浙大食堂分类体系
const CANTEEN_GROUPS = [
  { canteen: '大食堂', areas: ['风味', '休闲', '东区', '西区', '民族', '三楼'] },
  { canteen: '临湖', areas: ['一楼', '二楼'] },
  { canteen: '麦香', areas: [] },
  { canteen: '交叉中心', areas: [] },
  { canteen: '澄月', areas: ['一楼', '二楼', '三楼'] },
  { canteen: '玉湖', areas: ['一楼', '二楼'] },
  { canteen: '银泉', areas: ['一楼A区', '一楼B区', '速选', '自选', '西北风味', '小乐惠', '食天一隅'] },
  { canteen: '东二麦斯威', areas: [] },
];
const CANTEENS = CANTEEN_GROUPS.map(g => g.canteen);

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [filter, setFilter] = useState<FilterState>({
    category: '',
    canteen: '',
    area: '',
    maxPrice: 30,
    minCalories: 0,
    maxCalories: 1000,
    searchQuery: '',
  });

  // 审批申请列表（管理员用）
  const [proposals, setProposals] = useState<FoodProposal[]>([]);

  // 使用认证 Hook
  const {
    user,
    profile,
    loading: authLoading,
    isAdmin,
    isApproved,
    isPending,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  } = useAuth();

  // 从 Supabase 加载数据
  useEffect(() => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) { settled = true; setLoading(false); console.warn('数据加载超时'); }
    }, 5000);

    const loadFoods = async () => {
      try {
        const { data, error } = await supabase.from('foods').select('*').order('id');
        if (error) {
          console.error('加载数据失败:', error);
        } else if (data) {
          setFoods(data as FoodItem[]);
        }
      } catch (e) {
        console.error('加载数据异常:', e);
      } finally {
        if (!settled) { clearTimeout(timeout); settled = true; setLoading(false); }
      }
    };
    loadFoods();
  }, []);

  // 管理员：加载审批申请列表
  useEffect(() => {
    if (isAdmin) {
      loadProposals();
    }
  }, [isAdmin]);

  const loadProposals = async () => {
    const { data, error } = await supabase
      .from('food_proposals')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setProposals(data as FoodProposal[]);
    }
  };

  const filteredFoods = useMemo(() => {
    return foods.filter(f => {
      if (filter.category && f.category !== filter.category) return false;
      if (filter.canteen && f.canteen !== filter.canteen) return false;
      if (filter.area && f.area !== filter.area) return false;
      if (f.price > filter.maxPrice) return false;
      if (f.calories < filter.minCalories || f.calories > filter.maxCalories) return false;
      if (filter.searchQuery && !f.name.toLowerCase().includes(filter.searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [foods, filter]);

  // 检查是否有编辑权限（管理员直接生效，普通用户提交申请）
  const canEdit = isApproved || isAdmin;

  // ========== 提交审批申请（普通已审核用户）==========
  const submitProposal = async (action: 'create' | 'update' | 'delete', item: FoodItem) => {
    if (!user) return;

    const foodData = action === 'delete' ? {} : {
      name: item.name,
      category: item.category,
      canteen: item.canteen,
      area: item.area || '',
      window: item.window || '',
      price: item.price,
      calories: item.calories,
      protein: item.protein,
      fat: item.fat,
      carbs: item.carbs,
      fiber: item.fiber ?? 0,
      sodium: item.sodium ?? 0,
      nutritionScore: item.nutritionScore ?? 0,
      valueScore: item.valueScore ?? 0,
    };

    const proposalData: any = {
      user_id: user.id,
      action,
      data: foodData,
      status: 'pending',
    };

    // update 和 delete 需要关联已有餐品 ID
    if (action !== 'create' && item.id) {
      proposalData.food_id = Number(item.id);
    }

    console.log('提交申请数据:', JSON.stringify(proposalData, null, 2));

    const { error } = await supabase.from('food_proposals').insert([proposalData]);

    if (error) {
      console.error('提交申请失败:', error);
      alert('提交申请失败：' + error.message + '，请重试');
    } else {
      alert('已提交申请，等待管理员审批后生效');
    }
  };

  // ========== 保存（管理员直接生效，普通用户提交申请）==========
  const handleSave = async (item: FoodItem) => {
    if (!canEdit) {
      alert('您没有编辑权限，请联系管理员申请');
      return;
    }

    // 管理员：直接操作
    if (isAdmin) {
      if (isAdding) {
        const { data, error } = await supabase.from('foods').insert([{
          id: item.id ? Number(item.id) : Date.now(),
          name: item.name,
          category: item.category,
          canteen: item.canteen,
          area: item.area || null,
          window: item.window,
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
      } else {
        const { error } = await supabase.from('foods').update({
          name: item.name,
          category: item.category,
          canteen: item.canteen,
          area: item.area || null,
          window: item.window,
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
      }
      setIsAdding(false);
      setEditingItem(null);
      return;
    }

    // 普通已审核用户：提交申请
    await submitProposal(isAdding ? 'create' : 'update', item);
    setIsAdding(false);
    setEditingItem(null);
  };

  // ========== 删除（管理员直接生效，普通用户提交申请）==========
  const handleDelete = async (id: string) => {
    if (!canEdit) {
      alert('您没有删除权限，请联系管理员申请');
      return;
    }

    const item = foods.find(f => String(f.id) === String(id));
    if (!item) return;

    // 管理员：直接删除
    if (isAdmin) {
      if (!confirm('确认删除该餐品记录？')) return;
      const { error } = await supabase.from('foods').delete().eq('id', Number(id));
      if (error) {
        console.error('删除失败:', error);
        alert('删除失败，请重试');
        return;
      }
      setFoods(prev => prev.filter(f => String(f.id) !== String(id)));
      return;
    }

    // 普通已审核用户：提交删除申请
    if (!confirm('确认提交删除申请？审批通过后会生效。')) return;
    await submitProposal('delete', item);
  };

  // ========== 管理员审批==========
  const handleApproveProposal = async (proposalId: string) => {
    if (!isAdmin) return;
    const { error } = await supabase.rpc('apply_food_proposal', { proposal_id: proposalId });
    if (error) {
      console.error('审批失败:', error);
      alert('审批失败：' + error.message);
      return;
    }
    alert('审批通过，操作已生效');
    loadProposals();
    // 重新加载 foods
    const { data } = await supabase.from('foods').select('*').order('id');
    if (data) setFoods(data as FoodItem[]);
  };

  const handleRejectProposal = async (proposalId: string, note: string) => {
    if (!isAdmin) return;
    const { error } = await supabase.from('food_proposals').update({
      status: 'rejected',
      admin_note: note,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user!.id,
    }).eq('id', proposalId);
    if (error) {
      console.error('拒绝失败:', error);
      alert('操作失败，请重试');
      return;
    }
    alert('已拒绝该申请');
    loadProposals();
  };

  const handleAddNew = () => {
    if (!isApproved && !isAdmin) {
      setShowAuth(true);
      return;
    }
    setIsAdding(true);
    setEditingItem({
      id: '',
      name: '',
      category: CATEGORIES[0],
      canteen: CANTEENS[0],
      area: '',
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

  // 页面加载中（包括 auth 检测）
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
        <div className="text-[#1E40AF] text-lg font-medium">加载中...</div>
        <p className="text-gray-400 text-sm">如长时间无响应，请<button className="underline text-[#1E40AF] cursor-pointer" onClick={() => window.location.reload()}>刷新页面</button></p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar
        page={page}
        setPage={setPage}
        user={user}
        profile={profile}
        onLogin={() => setShowAuth(true)}
        onLogout={() => signOut()}
      />

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
              <p className="text-gray-500 mt-1">
                共收录 <span className="text-[#1E40AF] font-semibold">{foods.length}</span> 种餐品，
                筛选后显示 <span className="text-[#F59E0B] font-semibold">{filteredFoods.length}</span> 种
              </p>
              {!isAdmin && isApproved && (
                <p className="text-amber-600 text-sm mt-1">⚠️ 您的添加/修改/删除操作需管理员审批后生效</p>
              )}
            </div>
            <button
              onClick={handleAddNew}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                canEdit
                  ? 'bg-[#1E40AF] hover:bg-[#1E3A8A] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!canEdit}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {canEdit ? '添加餐品' : '登录后添加'}
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                  onChange={e => setFilter(f => ({ ...f, canteen: e.target.value, area: '' }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer"
                >
                  <option value="">全部食堂</option>
                  {CANTEENS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">分区</label>
                <select
                  value={filter.area}
                  onChange={e => setFilter(f => ({ ...f, area: e.target.value }))}
                  disabled={!filter.canteen || !(CANTEEN_GROUPS.find(g => g.canteen === filter.canteen)?.areas.length)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">全部分区</option>
                  {(CANTEEN_GROUPS.find(g => g.canteen === filter.canteen)?.areas || []).map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
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
            onEdit={(item) => {
              if (!canEdit) { setShowAuth(true); return; }
              setEditingItem(item);
            }}
            onDelete={handleDelete}
            canEdit={canEdit}
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

      {/* 管理员页面：用户审批 + 餐品变更审批 */}
      {page === 'admin' && isAdmin && (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-[#1E3A8A] mb-6">管理面板</h1>
          <AdminPanel
            onRefresh={refreshProfile}
            proposals={proposals}
            onApproveProposal={handleApproveProposal}
            onRejectProposal={handleRejectProposal}
            onProposalsChange={loadProposals}
          />
        </div>
      )}

      <Footer />

      {(editingItem || isAdding) && canEdit && (
        <FoodEditModal
          item={editingItem!}
          isNew={isAdding}
          onSave={handleSave}
          onClose={() => { setEditingItem(null); setIsAdding(false); }}
        />
      )}

      {/* 登录/注册弹窗 */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSignUp={signUp}
          onSignIn={signIn}
        />
      )}
    </div>
  );
};

const AboutPage: React.FC = () => (
  <div className="space-y-10">
    {/* Header */}
    <div>
      <span className="inline-block bg-[#EFF6FF] text-[#1E40AF] text-xs font-semibold px-3 py-1 rounded-full mb-3">关于项目</span>
      <h1 className="text-3xl font-bold text-[#1E3A8A] mb-4">浙江大学食堂餐品营养成分数据库</h1>
      <p className="text-gray-600 leading-relaxed text-lg">
        本项目隶属于<strong>浙江大学学生科研训练计划（SQTP）</strong>，通过系统性拆解与测算学校食堂各餐品的热量、宏量营养素含量及性价比指标，构建可查询、可比较的餐品营养数据库，为师生日常选餐提供科学、透明的数据参考。
      </p>
    </div>

    {/* Feature cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { icon: '🔬', title: '科学测算', desc: '基于中国食物成分表（第6版），结合实物称量与配比分析，系统估算每道餐品的宏量营养素含量。' },
        { icon: '📊', title: '数据公开透明', desc: '所有餐品数据在本平台完整公开，支持多维度筛选、排序与可视化对比，促进食堂餐饮信息公开。' },
        { icon: '💡', title: '理性选餐辅助', desc: '综合热量密度、蛋白质占比、性价比等维度构建评分体系，帮助师生做出更健康、更经济的饮食决策。' },
      ].map(item => (
        <div key={item.title} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="text-3xl mb-3">{item.icon}</div>
          <h3 className="font-semibold text-[#1E3A8A] text-lg mb-2">{item.title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>

    {/* Methodology */}
    <div className="bg-[#EFF6FF] rounded-xl p-8">
      <h2 className="text-xl font-bold text-[#1E3A8A] mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#1E40AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
        研究方法
      </h2>
      <ul className="space-y-4 text-gray-600">
        <li className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-[#1E40AF] shadow-sm">1</span>
          <div><strong>现场采集</strong>：对食堂在售餐品进行实物采集，使用电子秤称量并分类记录各组分重量</div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-[#1E40AF] shadow-sm">2</span>
          <div><strong>成分查表</strong>：参照《中国食物成分表（第6版）》查询各类食材的标准营养素含量</div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-[#1E40AF] shadow-sm">3</span>
          <div><strong>配比计算</strong>：根据各组分的实际重量比例计算整份餐品的热量及各项营养指标</div>
        </li>
        <li className="flex gap-3 items-start">
          <span className="flex-shrink-0 w-7 h-7 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-[#1E40AF] shadow-sm">4</span>
          <div><strong>综合评估</strong>：结合售价计算热量/价格比（性价比）与多维度营养评分</div>
        </li>
      </ul>
    </div>

    {/* Team */}
    <div>
      <h2 className="text-xl font-bold text-[#1E3A8A] mb-4">项目团队</h2>
      <div className="flex flex-wrap gap-3">
        {['杨潘（项目负责人）', '数据采集团队', '营养分析团队'].map(m => (
          <span key={m} className="bg-white border border-[#BFDBFE] text-[#1E40AF] px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-50 transition-colors cursor-default">{m}</span>
        ))}
      </div>
    </div>
  </div>
);

export default App;
