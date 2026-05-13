import { useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
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

  const fetchProfile = async (userId: string) => {
    try {
      const records = await pb.collection('profiles').getList(1, 1, {
        filter: `user_id="${userId}"`,
      });
      if (records.items.length > 0) {
        return records.items[0] as unknown as Profile;
      }
    } catch (e) {
      console.error('获取 profile 失败:', e);
    }
    return null;
  };

  useEffect(() => {
    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        setAuth({ user: null, profile: null, loading: false });
      }
    }, 3000);

    const init = async () => {
      try {
        // PocketBase 自动恢复了 localStorage 中的 session
        const model = pb.authStore.model;
        if (model) {
          const profile = await fetchProfile(model.id);
          if (!settled) {
            clearTimeout(timeout);
            settled = true;
            setAuth({ user: model, profile, loading: false });
          }
        } else {
          if (!settled) {
            clearTimeout(timeout);
            settled = true;
            setAuth({ user: null, profile: null, loading: false });
          }
        }
      } catch (e) {
        if (!settled) {
          clearTimeout(timeout);
          settled = true;
          setAuth({ user: null, profile: null, loading: false });
        }
      }
    };
    init();

    // 监听登录状态变化
    const unsubscribe = pb.authStore.onChange(async (token, model) => {
      if (model) {
        const profile = await fetchProfile(model.id);
        setAuth({ user: model, profile, loading: false });
      } else {
        setAuth({ user: null, profile: null, loading: false });
      }
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string): Promise<{ success: boolean; error: string }> => {
    if (!email.includes('@zju.edu.cn')) {
      return { success: false, error: '只允许使用浙大教育邮箱（@zju.edu.cn）注册' };
    }

    const timeoutPromise = new Promise<{ success: false; error: string }>(resolve =>
      setTimeout(() => resolve({ success: false, error: '请求超时，请检查网络连接后重试' }), 8000)
    );

    const signUpPromise = (async () => {
      try {
        const user = await pb.collection('users').create({
          email,
          password,
          passwordConfirm: password,
        });

        // 自动创建 profile
        try {
          await pb.collection('profiles').create({
            user_id: user.id,
            email,
            role: 'pending',
          });
        } catch (e) {
          console.error('创建 profile 失败:', e);
        }

        // 自动登录
        await pb.collection('users').authWithPassword(email, password);
        return { success: true, error: '' };
      } catch (e: any) {
        let msg = e.message || '注册失败';
        if (msg.includes('duplicate') || msg.includes('already exists')) {
          msg = '该邮箱已被注册，请直接登录';
        }
        return { success: false, error: msg };
      }
    })();

    return Promise.race([signUpPromise, timeoutPromise]);
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error: string }> => {
    const timeoutPromise = new Promise<{ success: false; error: string }>(resolve =>
      setTimeout(() => resolve({ success: false, error: '请求超时，请检查网络连接后重试' }), 8000)
    );

    const signInPromise = (async () => {
      try {
        await pb.collection('users').authWithPassword(email, password);
        return { success: true, error: '' };
      } catch (e: any) {
        let msg = e.message || '登录失败';
        if (msg.includes('Failed to authenticate')) {
          msg = '邮箱或密码错误，请检查后重试';
        }
        return { success: false, error: msg };
      }
    })();

    return Promise.race([signInPromise, timeoutPromise]);
  };

  const signOut = async () => {
    pb.authStore.clear();
    setAuth({ user: null, profile: null, loading: false });
  };

  const refreshProfile = async () => {
    if (auth.user) {
      const profile = await fetchProfile(auth.user.id);
      setAuth(prev => ({ ...prev, profile }));
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
