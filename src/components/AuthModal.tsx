import React, { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onSignUp: (email: string, password: string) => Promise<{ success: boolean; error: string }>;
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error: string }>;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSignUp, onSignIn }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');

    // 验证邮箱
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }

    if (mode === 'register') {
      if (password.length < 8) {
        setError('密码长度不能少于8位');
        return;
      }
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        return;
      }
    }

    setLoading(true);

    if (mode === 'register') {
      const result = await onSignUp(email, password);
      setLoading(false);
      if (result.success) {
        setSuccessMsg('注册成功！请登录您的账号。');
        setTimeout(() => setMode('login'), 2000);
      } else {
        setError(result.error);
      }
    } else {
      const result = await onSignIn(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] px-8 py-6">
          <h2 className="text-xl font-bold text-white">
            {mode === 'register' ? '注册账号' : '用户登录'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {mode === 'register' ? '使用浙大教育邮箱注册，申请编辑权限' : '登录以访问完整功能'}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4">
          {/* Error / Success */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">邮箱地址</label>
            <input
              type="email"
              placeholder={mode === 'register' ? 'xxx@zju.edu.cn' : '请输入邮箱'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">密码</label>
            <input
              type="password"
              placeholder="请输入密码（至少8位）"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
            />
          </div>

          {/* Confirm Password (only for register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">确认密码</label>
              <input
                type="password"
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* ZJU email hint */}
          {mode === 'register' && (
            <p className="text-xs text-amber-600 flex items-start gap-1">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              仅支持浙大教育邮箱（@zju.edu.cn），注册后需管理员审批才能编辑数据。
            </p>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all duration-200 ${
              loading
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-[#1E40AF] hover:bg-[#1E3A8A] text-white'
            }`}
          >
            {loading ? '处理中...' : mode === 'register' ? '立即注册' : '登 录'}
          </button>

          {/* Switch Mode */}
          <p className="text-center text-sm text-gray-500">
            {mode === 'register' ? '已有账号？' : '还没有账号？'}
            <button
              onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}
              className="text-[#1E40AF] hover:text-[#1E3A8A] font-medium ml-1 cursor-pointer"
            >
              {mode === 'register' ? '去登录' : '立即注册'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
