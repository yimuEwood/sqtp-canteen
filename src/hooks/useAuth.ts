import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  // 获取用户 profile
  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data) {
      return data as Profile;
    }
    return null;
  };

  // 初始化：检查当前登录状态
  useEffect(() => {
    let settled = false;

    // 超时兜底：3秒内如果没有响应，强制结束 loading
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        console.warn('Auth 初始化超时，强制跳过');
        setAuth({ user: null, profile: null, loading: false });
      }
    }, 3000);

    // 获取当前 session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (settled) return;
      clearTimeout(timeout);
      settled = true;
      if (error) {
        console.error('获取 session 失败:', error);
      }
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          setAuth({ user: session.user, profile, loading: false });
        }).catch(() => {
          setAuth({ user: session.user, profile: null, loading: false });
        });
      } else {
        setAuth({ user: null, profile: null, loading: false });
      }
    }).catch((err) => {
      console.error('getSession 异常:', err);
      if (!settled) {
        clearTimeout(timeout);
        settled = true;
        setAuth({ user: null, profile: null, loading: false });
      }
    });

    // 监听登录状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setAuth({ user: session.user, profile, loading: false });
        } else {
          setAuth({ user: null, profile: null, loading: false });
        }
      }
    );

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // 注册（只允许 @zju.edu.cn 邮箱）
  const signUp = async (email: string, password: string): Promise<{ success: boolean; error: string }> => {
    // 检查邮箱域名（支持 @zju.edu.cn）
    if (!email.includes('@zju.edu.cn')) {
      return { success: false, error: '只允许使用浙大教育邮箱（@zju.edu.cn）注册' };
    }

    // 8 秒超时兜底
    const timeoutPromise = new Promise<{ success: false; error: string }>(resolve =>
      setTimeout(() => resolve({ success: false, error: '请求超时，请检查网络连接后重试' }), 8000)
    );

    const signUpPromise = (async () => {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { email_confirm: true },
        },
      });

      if (error) {
        let errorMsg = error.message;
        switch (error.status) {
          case 422:
            errorMsg = '该邮箱已被注册，请直接登录';
            break;
          default:
            break;
        }
        return { success: false, error: errorMsg };
      }

      // 注册成功后自动创建 profile 记录
      if (data?.user) {
        const { error: profileError } = await supabase.from('profiles').insert([{
          id: data.user.id,
          email: email,
          role: 'pending',
        }]);
        if (profileError) {
          console.error('创建 profile 失败:', profileError);
        }
      }

      return { success: true, error: '' };
    })();

    return Promise.race([signUpPromise, timeoutPromise]);
  };

  // 登录
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error: string }> => {
    // 8 秒超时兜底
    const timeoutPromise = new Promise<{ success: false; error: string }>(resolve =>
      setTimeout(() => resolve({ success: false, error: '请求超时，请检查网络连接后重试' }), 8000)
    );

    const signInPromise = (async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMsg = error.message;
        switch (error.status) {
          case 400:
            errorMsg = '邮箱或密码错误，请检查后重试';
            break;
          default:
            break;
        }
        return { success: false, error: errorMsg };
      }

      return { success: true, error: '' };
    })();

    return Promise.race([signInPromise, timeoutPromise]);
  };

  // 登出
  const signOut = async () => {
    await supabase.auth.signOut();
    setAuth({ user: null, profile: null, loading: false });
  };

  // 刷新 profile（审批操作后调用）
  const refreshProfile = async () => {
    if (auth.user) {
      const profile = await fetchProfile(auth.user.id);
      setAuth(prev => ({ ...prev!, profile }));
    }
  };

  return {
    user: auth.user,
    profile: auth.profile,
    loading: auth.loading,
    isAdmin: auth.profile?.role === 'admin',
    isApproved: auth.profile?.role === 'admin' || auth.profile?.role === 'approved',
    isPending: auth.profile?.role === 'pending',
    isAuthenticated: !!auth.user,
    signUp,
    signIn,
    signOut,
    refreshProfile,
  };
}
