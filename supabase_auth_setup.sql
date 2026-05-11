-- =====================================================
-- SQTP 食堂营养数据平台 - 用户权限系统 SQL
-- 在 Supabase SQL Editor 中运行
-- =====================================================

-- 1. 创建 profiles 表（存储用户信息与角色）
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'pending',  -- 'pending' = 待审批, 'approved' = 已批准, 'admin' = 管理员
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全策略
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 策略1: 已登录用户可以查看所有 profiles（用于管理员审批）
CREATE POLICY "Authenticated users can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

-- 策略2: 已登录用户可以更新自己的 profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 策略3: 允许 admin 更新其他用户的 role 字段
CREATE POLICY "Admin can update roles"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 策略4: 允许已登录用户插入自己的 profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 2. 创建触发器函数：新用户注册时自动创建 profile 记录
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'pending');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建 trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 运行完成后：
-- 1. 你自己注册一个账号后，在 Supabase 后台 → Authentication → Users 中
--    找到你的账号，记下 User ID
-- 2. 然后在 SQL Editor 中运行以下命令把你设为管理员（替换 YOUR_USER_ID）：
--
--   UPDATE public.profiles SET role = 'admin' WHERE id = 'YOUR_USER_ID';
--
-- =====================================================
