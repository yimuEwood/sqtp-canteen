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

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-8 border border-white/15 shadow-lg shadow-black/10">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            浙江大学 SQTP 项目
            <span className="ml-0.5 bg-white/20 text-xs px-2 py-0.5 rounded-full font-mono">V1.0</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold leading-[1.15] tracking-tight mb-6">
            浙江大学食堂餐品<br />
            <span className="relative">
              <span className="bg-gradient-to-r from-[#FCD34D] via-[#FBBF24] to-[#F59E0B] bg-clip-text text-transparent">营养成分数据库</span>
              <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 400 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 8C60 2 140 2 200 7C260 11 340 4 398 9" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-blue-100/90 leading-relaxed mb-10 max-w-xl font-light">
            基于中国食物成分表与实测数据，系统测算每道餐品的热量、宏量营养素及性价比，
            为浙江大学师生提供科学、透明、可量化的餐饮营养参考。
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-14">
            <button
              onClick={() => setPage('data')}
              className="group bg-white text-[#1E40AF] hover:bg-blue-50 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2.5 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              浏览餐品数据
            </button>
            <button
              onClick={() => setPage('charts')}
              className="group border border-white/30 hover:bg-white/10 hover:border-white/50 px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2.5 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              数据可视化分析
            </button>
          </div>

          {/* Quick stats strip */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-sm text-blue-200/80">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
              覆盖三大校区食堂
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
              实物称量 + 配比计算
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FCD34D]" />
              持续更新维护中
            </div>
          </div>
        </div>

        {/* Right side decorative illustration */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.08]">
          <svg width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="160" cy="160" r="150" stroke="white" strokeWidth="1.5"/>
            <circle cx="160" cy="160" r="120" stroke="white" strokeWidth="1" opacity="0.5"/>
            <circle cx="160" cy="160" r="90" stroke="white" strokeWidth="1" opacity="0.3"/>
            <line x1="160" y1="10" x2="160" y2="310" stroke="white" strokeWidth="1" opacity="0.3"/>
            <line x1="10" y1="160" x2="310" y2="160" stroke="white" strokeWidth="1" opacity="0.3"/>
            <circle cx="230" cy="100" r="25" fill="white" opacity="0.15"/>
            <circle cx="95" cy="220" r="18" fill="white" opacity="0.1"/>
          </svg>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[70px]">
          <path d="M0 70L48 65C96 60 192 50 288 52C384 54 480 68 576 67C672 66 768 50 864 46C960 42 1056 50 1152 55C1248 60 1344 62 1392 63L1440 64V70H1392C1344 70 1248 70 1152 70C1056 70 960 70 864 70C768 70 672 70 576 70C480 70 384 70 288 70C192 70 96 70 48 70H0Z" fill="#F8FAFC"/>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
