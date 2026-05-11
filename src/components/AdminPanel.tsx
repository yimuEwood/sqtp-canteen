import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AdminPanelProps {
  onRefresh: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onRefresh }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载所有用户列表
  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProfiles(data);
    setLoading(false);
  };

  // 批准用户
  const approveUser = async (profileId: string) => {
    if (!confirm('确定批准该用户的编辑权限？')) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'approved' })
      .eq('id', profileId);

    if (!error) {
      loadProfiles();
      onRefresh();
    }
  };

  // 拒绝/撤销权限
  const rejectUser = async (profileId: string) => {
    if (!confirm('确定撤销该用户的编辑权限？')) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'pending' })
      .eq('id', profileId);

    if (!error) {
      loadProfiles();
      onRefresh();
    }
  };

  // 设置管理员
  const setAdmin = async (profileId: string) => {
    if (!confirm('确定将此用户设为管理员？')) return;
    
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', profileId);

    if (!error) {
      loadProfiles();
      onRefresh();
    }
  };

  const pendingUsers = profiles.filter(p => p.role === 'pending');
  const approvedUsers = profiles.filter(p => p.role === 'approved');
  const adminUsers = profiles.filter(p => p.role === 'admin');

  const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
      role === 'admin' ? 'bg-red-100 text-red-700' :
      role === 'approved' ? 'bg-green-100 text-green-700' :
      'bg-amber-100 text-amber-700'
    }`}>
      {role === 'admin' ? '管理员' : role === 'approved' ? '已批准' : '待审批'}
    </span>
  );

  if (loading) {
    return <div className="text-gray-500 text-sm">加载中...</div>;
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
};

export default AdminPanel;
