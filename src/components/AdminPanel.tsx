import React, { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
import type { Profile, FoodProposal } from '../types';

interface AdminPanelProps {
  onRefresh: () => void;
  proposals: FoodProposal[];
  onApproveProposal: (id: string) => void;
  onRejectProposal: (id: string, note: string) => void;
  onProposalsChange: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  onRefresh,
  proposals,
  onApproveProposal,
  onRejectProposal,
  onProposalsChange,
}) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'proposals' | 'users'>('proposals');
  const [rejectNote, setRejectNote] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  // 加载所有用户列表
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('profiles').getFullList({ sort: '-created' });
      setProfiles(records as unknown as Profile[]);
    } catch (e) {
      console.error('加载用户失败:', e);
    }
    setLoading(false);
  };

  // 批准用户
  const approveUser = async (profileId: string) => {
    if (!confirm('确定批准该用户的编辑权限？')) return;
    try {
      await pb.collection('profiles').update(profileId, { role: 'approved' });
      loadProfiles();
      onRefresh();
    } catch (e) {
      console.error('批准失败:', e);
    }
  };

  // 拒绝/撤销权限
  const rejectUser = async (profileId: string) => {
    if (!confirm('确定撤销该用户的编辑权限？')) return;
    try {
      await pb.collection('profiles').update(profileId, { role: 'pending' });
      loadProfiles();
      onRefresh();
    } catch (e) {
      console.error('撤销失败:', e);
    }
  };

  // 设置管理员
  const setAdmin = async (profileId: string) => {
    if (!confirm('确定将此用户设为管理员？')) return;
    try {
      await pb.collection('profiles').update(profileId, { role: 'admin' });
      loadProfiles();
      onRefresh();
    } catch (e) {
      console.error('设置管理员失败:', e);
    }
  };

  const pendingUsers = profiles.filter(p => p.role === 'pending');
  const approvedUsers = profiles.filter(p => p.role === 'approved');
  const adminUsers = profiles.filter(p => p.role === 'admin');

  const pendingProposals = proposals.filter(p => p.status === 'pending');

  const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      role === 'admin' ? 'bg-red-100 text-red-700' :
      role === 'approved' ? 'bg-green-100 text-green-700' :
      'bg-amber-100 text-amber-700'
    }`}>
      {role === 'admin' ? '管理员' : role === 'approved' ? '已批准' : '待审批'}
    </span>
  );

  // 操作类型中文映射
  const actionLabel: Record<string, string> = {
    create: '新增餐品',
    update: '修改餐品',
    delete: '删除餐品',
  };

  // 状态标签
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      status === 'pending' ? 'bg-amber-100 text-amber-700' :
      status === 'approved' ? 'bg-green-100 text-green-700' :
      'bg-gray-100 text-gray-600'
    }`}>
      {status === 'pending' ? '待审批' : status === 'approved' ? '已通过' : '已拒绝'}
    </span>
  );

  if (loading) {
    return <div className="text-gray-500 text-sm">加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 标签切换 */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setTab('proposals')}
          className={`pb-3 text-sm font-medium cursor-pointer transition-colors border-b-2 ${
            tab === 'proposals'
              ? 'border-[#1E40AF] text-[#1E40AF]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          餐品变更审批
          {pendingProposals.length > 0 && (
            <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{pendingProposals.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('users')}
          className={`pb-3 text-sm font-medium cursor-pointer transition-colors border-b-2 ${
            tab === 'users'
              ? 'border-[#1E40AF] text-[#1E40AF]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          用户管理
          {pendingUsers.length > 0 && (
            <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">{pendingUsers.length}</span>
          )}
        </button>
      </div>

      {/* ===== 餐品变更审批标签页 ===== */}
      {tab === 'proposals' && (
        <div className="space-y-6">
          {/* 待审批 */}
          <div>
            <h3 className="text-base font-semibold text-[#1E3A8A] mb-3">
              待审批的餐品变更（{pendingProposals.length}）
            </h3>
            {pendingProposals.length === 0 ? (
              <p className="text-gray-400 text-sm">暂无待审批的变更申请</p>
            ) : (
              <div className="space-y-3">
                {pendingProposals.map(proposal => (
                  <div key={proposal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#BFDBFE] transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          proposal.action === 'create' ? 'bg-blue-100 text-blue-700' :
                          proposal.action === 'update' ? 'bg-purple-100 text-purple-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {actionLabel[proposal.action]}
                        </span>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(proposal.created_at).toLocaleString('zh-CN')}
                      </span>
                    </div>

                    {/* 显示变更详情 */}
                    {proposal.data && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm space-y-1">
                        <p><span className="text-gray-500">名称：</span>{proposal.data.name}</p>
                        <p><span className="text-gray-500">食堂：</span>{proposal.data.canteen}{proposal.data.area ? ` · ${proposal.data.area}` : ''} / <span className="text-gray-500">分类：</span>{proposal.data.category}</p>
                        <p><span className="text-gray-500">价格：¥</span>{proposal.data.price} · 热量：<span className="font-medium text-[#F59E0B]">{proposal.data.calories} kcal</span></p>
                        <p className="text-xs text-gray-400 mt-1">蛋白质{proposal.data.protein}g · 脂肪{proposal.data.fat}g · 碳水{proposal.data.carbs}g</p>
                      </div>
                    )}

                    {proposal.action === 'delete' && (
                      <div className="mt-2 p-3 bg-red-50 rounded-md text-sm text-red-600">
                        将删除该条餐品记录
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                      {rejectingId === proposal.id ? (
                        <div className="flex items-center gap-2 flex-1 mr-4">
                          <input
                            type="text"
                            placeholder="拒绝原因（可选）"
                            value={rejectNote}
                            onChange={e => setRejectNote(e.target.value)}
                            className="flex-1 border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                onRejectProposal(proposal.id, rejectNote);
                                setRejectingId(null);
                                setRejectNote('');
                              }
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => {
                              onRejectProposal(proposal.id, rejectNote);
                              setRejectingId(null);
                              setRejectNote('');
                            }}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm cursor-pointer transition-colors whitespace-nowrap"
                          >确认拒绝</button>
                          <button
                            onClick={() => { setRejectingId(null); setRejectNote(''); }}
                            className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded text-sm cursor-pointer transition-colors whitespace-nowrap"
                          >取消</button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => onApproveProposal(proposal.id)}
                            className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm cursor-pointer transition-colors"
                          >✓ 通过</button>
                          <button
                            onClick={() => { setRejectingId(proposal.id); setRejectNote(''); }}
                            className="px-4 py-1.5 border border-red-300 text-red-600 hover:bg-red-50 rounded text-sm cursor-pointer transition-colors"
                          >✗ 拒绝</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 已处理 */}
          {proposals.some(p => p.status !== 'pending') && (
            <div>
              <h3 className="text-base font-semibold text-gray-500 mb-3">
                已处理的申请（{proposals.filter(p => p.status !== 'pending').length}）
              </h3>
              <div className="space-y-2">
                {proposals.filter(p => p.status !== 'pending').map(proposal => (
                  <div key={proposal.id} className="bg-gray-50 border border-gray-100 rounded-lg p-3 opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          proposal.action === 'create' ? 'bg-blue-100 text-blue-600' :
                          proposal.action === 'update' ? 'bg-purple-100 text-purple-600' :
                          'bg-red-100 text-red-600'
                        }`}>{actionLabel[proposal.action]}</span>
                        <span>{proposal.data?.name || '删除操作'}</span>
                      </div>
                      <StatusBadge status={proposal.status} />
                    </div>
                    {proposal.admin_note && (
                      <p className="text-xs text-gray-400 mt-1 ml-2">备注：{proposal.admin_note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== 用户管理标签页 ===== */}
      {tab === 'users' && (
        <>
          {/* 待审批用户 */}
          <div>
            <h3 className="text-base font-semibold text-[#1E3A8A] mb-3 flex items-center gap-2">
              <span>待审批用户</span>
              {pendingUsers.length > 0 && (
                <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{pendingUsers.length}</span>
              )}
            </h3>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-400 text-sm">暂无待审批的用户</p>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600">邮箱</th>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600">注册时间</th>
                      <th className="text-right px-4 py-2.5 font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(p => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5">{p.email}</td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs">
                          {new Date(p.created_at).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-4 py-2.5 text-right space-x-2">
                          <button
                            onClick={() => approveUser(p.id)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs cursor-pointer transition-colors"
                          >批准</button>
                          <button
                            onClick={() => setAdmin(p.id)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs cursor-pointer transition-colors"
                          >设为管理员</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 已批准用户 */}
          <div>
            <h3 className="text-base font-semibold text-[#1E3A8A] mb-3">
              已批准用户（{approvedUsers.length}）
            </h3>
            {approvedUsers.length === 0 ? (
              <p className="text-gray-400 text-sm">暂无已批准的用户</p>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-medium text-gray-600">邮箱</th>
                      <th className="text-center px-4 py-2.5 font-medium text-gray-600">角色</th>
                      <th className="text-right px-4 py-2.5 font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedUsers.map(p => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-2.5">{p.email}</td>
                        <td className="px-4 py-2.5 text-center"><RoleBadge role={p.role} /></td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => rejectUser(p.id)}
                            className="px-3 py-1 bg-red-400 hover:bg-red-500 text-white rounded text-xs cursor-pointer transition-colors"
                          >撤销</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 管理员列表 */}
          <div>
            <h3 className="text-base font-semibold text-[#1E3A8A] mb-3">
              管理员（{adminUsers.length}）
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-gray-600">邮箱</th>
                    <th className="text-center px-4 py-2.5 font-medium text-gray-600">角色</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(p => (
                    <tr key={p.id} className="border-t border-gray-100">
                      <td className="px-4 py-2.5">{p.email}</td>
                      <td className="px-4 py-2.5 text-center"><RoleBadge role={p.role} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
