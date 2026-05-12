import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-[#1E3A8A] text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-[#FCD34D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold text-lg">浙大食堂营养数据</span>
          </div>
          <p className="text-blue-200/80 text-sm leading-relaxed">
            浙江大学 SQTP 项目 · 浙江大学食堂餐品营养成分数据库 V1.0
          </p>
          <p className="text-blue-200/60 text-xs mt-3 leading-relaxed">
            基于实测与食物成分表，为师生提供科学透明的餐饮营养参考。
          </p>
        </div>

        {/* Data info */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-blue-100">数据说明</h4>
          <ul className="space-y-2 text-sm text-blue-200/70">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-[#FCD34D] flex-shrink-0" />
              数据来源：中国食物成分表（第6版）
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-[#FCD34D] flex-shrink-0" />
              测算方法：实物称量 + 配比计算
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-[#FCD34D] flex-shrink-0" />
              营养评分：综合热量、蛋白质、性价比等多维度
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
              持续更新中，欢迎反馈修正
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <div>
          <h4 className="font-semibold mb-3 text-sm text-blue-100">免责声明</h4>
          <p className="text-blue-200/70 text-sm leading-relaxed">
            本数据库所列营养数据均为估算值，仅供日常饮食参考。实际营养成分因食材批次、烹饪工艺及份量差异可能存在波动，请勿将本数据作为临床医疗或专业营养诊断的依据。
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-blue-300/60 text-xs">
          © 2025 SQTP 项目 · 浙江大学
        </p>
        <p className="text-blue-300/60 text-xs">
          浙大食堂餐品营养成分数据库 V1.0
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
