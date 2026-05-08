import React from 'react';

type Page = 'home' | 'data' | 'charts' | 'about';

interface HeroSectionProps {
  setPage: (p: Page) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setPage }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6] text-white">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
            <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" />
            浙江大学 SQTP 学生科研项目
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            食堂餐品热量与<br />
            <span className="text-[#FCD34D]">营养成分数据库</span>
          </h1>

          <p className="text-lg text-blue-100 leading-relaxed mb-10 max-w-2xl">
            通过科学方法系统拆解学校食堂餐品，测算热量、蛋白质、脂肪、碳水化合物及性价比数据，帮助同学理性选餐、科学饮食。
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setPage('data')}
              className="bg-white text-[#1E40AF] hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              查看全部餐品
            </button>
            <button
              onClick={() => setPage('charts')}
              className="border border-white/40 hover:bg-white/10 px-6 py-3 rounded-xl font-semibold transition-colors duration-200 cursor-pointer flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              数据可视化
            </button>
          </div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L1440 60L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 60Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
