import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-[#1E3A8A] text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="font-bold">食堂营养数据平台</span>
          </div>
          <p className="text-blue-200 text-sm leading-relaxed">
            浙江大学 SQTP 学生科研训练项目，系统测算食堂餐品营养数据，助力科学饮食。
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">数据说明</h4>
          <ul className="space-y-1.5 text-sm text-blue-200">
            <li>数据来源：中国食物成分表（第6版）</li>
            <li>测算方法：实物称量 + 配比计算</li>
            <li>营养评分：综合多维度指标</li>
            <li>持续更新中，欢迎反馈修正</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">免责声明</h4>
          <p className="text-blue-200 text-sm leading-relaxed">
            本数据为估算值，仅供参考。实际营养成分因食材批次、烹饪方式等因素存在差异，请勿作为医疗营养建议。
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-blue-300 text-xs">© 2024 SQTP 食堂营养数据项目 · 浙江大学</p>
        <p className="text-blue-300 text-xs">数据持续完善中 · 欢迎加入研究团队</p>
      </div>
    </div>
  </footer>
);

export default Footer;
