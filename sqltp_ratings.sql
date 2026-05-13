-- ========================================
-- 口味评分系统 - ratings 表
-- ========================================

CREATE TABLE IF NOT EXISTS public.ratings (
  id BIGSERIAL PRIMARY KEY,
  food_id BIGINT REFERENCES public.foods(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引：按餐品查询评分
CREATE INDEX IF NOT EXISTS idx_ratings_food_id ON public.ratings(food_id);

-- 启用行级安全
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- 任何人可查看评分
CREATE POLICY "任何人可查看评分" ON public.ratings
  FOR SELECT USING (true);

-- 已登录用户可提交评分
CREATE POLICY "已登录用户可评分" ON public.ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 更新 foods 表：添加评分字段（如果还没加）
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS avg_rating REAL DEFAULT 0;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;
