import React from 'react';

type Page = 'home' | 'data' | 'charts' | 'about';

interface NavbarProps {
  page: Page;
  setPage: (p: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ page, setPage }) => {
  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: '首页' },
    { id: 'data', label: '餐品数据' },
    { id: 'charts', label: '数据可视化' },
    { id: 'about', label: '关于项目' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
          <div className="w-8 h-8 bg-[#1E40AF] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-[#1E3A8A] text-base">食堂营养数据</span>
            <span className="text-xs text-gray-400 ml-2 hidden sm:inline">SQTP 研究项目</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                page === item.id
                  ? 'bg-[#EFF6FF] text-[#1E40AF]'
                  : 'text-gray-600 hover:text-[#1E40AF] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
