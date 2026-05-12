import React from 'react';

type Page = 'home' | 'data' | 'charts' | 'about' | 'admin';

interface NavbarProps {
  page: Page;
  setPage: (p: Page) => void;
  user: any | null;
  profile: { role: string } | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ page, setPage, user, profile, onLogin, onLogout }) => {
  const navItems: { id: Page; label: string; needAuth?: boolean }[] = [
    { id: 'home', label: '首页' },
    { id: 'data', label: '餐品数据' },
    { id: 'charts', label: '数据可视化' },
    { id: 'about', label: '关于项目' },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ id: 'admin', label: '管理面板' });
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
          <div className="w-8 h-8 bg-gradient-to-br from-[#1E40AF] to-[#3B82F6] rounded-lg flex items-center justify-center shadow-sm shadow-blue-200">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-[#1E3A8A] text-base">浙大食堂营养数据</span>
            <span className="text-xs text-gray-300 ml-1.5 hidden sm:inline font-mono tracking-tight">V1.0</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                page === item.id
                  ? 'bg-[#EFF6FF] text-[#1E40AF] font-semibold'
                  : 'text-gray-600 hover:text-[#1E40AF] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* User area */}
          {!user ? (
            <button
              onClick={onLogin}
              className="ml-2 px-4 py-2 bg-[#1E40AF] hover:bg-[#1E3A8A] text-white rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer shadow-sm"
            >
              登录 / 注册
            </button>
          ) : (
            <div className="ml-2 flex items-center gap-2 pl-4 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-400">当前用户</p>
                <p className="text-sm font-medium text-[#1E3A8A] truncate max-w-[120px]">{user.email}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                profile?.role === 'admin' ? 'bg-red-50 text-red-600 ring-1 ring-red-100' :
                profile?.role === 'approved' ? 'bg-green-50 text-green-600 ring-1 ring-green-100' :
                'bg-amber-50 text-amber-600 ring-1 ring-amber-100'
              }`}>
                {profile?.role === 'admin' ? '管理员' :
                 profile?.role === 'approved' ? '已批准' :
                 '待审批'}
              </span>
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm cursor-pointer transition-colors"
              >
                退出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
