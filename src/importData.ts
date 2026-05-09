import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env' })

const supabaseUrl = process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY!

console.log('URL:', supabaseUrl)
console.log('Key prefix:', supabaseAnonKey?.slice(0, 10))

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const foods = [
  { id: 1, name: '红烧肉饭', category: '荤菜盖饭', canteen: '第一食堂', price: 8.0, calories: 520, protein: 18.5, fat: 22.0, carbs: 62.0, fiber: 1.2, sodium: 680, valueScore: 65.0, nutritionScore: 58 },
  { id: 2, name: '清炒时蔬', category: '素菜', canteen: '第一食堂', price: 3.0, calories: 75, protein: 2.1, fat: 4.5, carbs: 7.8, fiber: 2.8, sodium: 320, valueScore: 25.0, nutritionScore: 82 },
  { id: 3, name: '水煮鱼片', category: '荤菜', canteen: '第二食堂', price: 12.0, calories: 340, protein: 28.0, fat: 18.5, carbs: 12.0, fiber: 0.8, sodium: 920, valueScore: 28.3, nutritionScore: 71 },
  { id: 4, name: '番茄鸡蛋面', category: '面食', canteen: '第三食堂', price: 7.0, calories: 415, protein: 14.2, fat: 9.8, carbs: 68.5, fiber: 2.5, sodium: 560, valueScore: 59.3, nutritionScore: 74 },
  { id: 5, name: '蒸蛋羹', category: '蛋类', canteen: '第一食堂', price: 2.5, calories: 130, protein: 10.8, fat: 8.2, carbs: 2.5, fiber: 0, sodium: 280, valueScore: 52.0, nutritionScore: 88 },
  { id: 6, name: '卤鸡腿饭', category: '荤菜盖饭', canteen: '第二食堂', price: 10.0, calories: 580, protein: 32.0, fat: 16.5, carbs: 70.0, fiber: 1.8, sodium: 750, valueScore: 58.0, nutritionScore: 65 },
  { id: 7, name: '麻辣烫（素）', category: '汤类/火锅', canteen: '第三食堂', price: 9.0, calories: 390, protein: 12.5, fat: 14.0, carbs: 55.0, fiber: 5.2, sodium: 1100, valueScore: 43.3, nutritionScore: 55 },
  { id: 8, name: '豆腐脑', category: '豆制品', canteen: '第一食堂', price: 2.0, calories: 80, protein: 8.5, fat: 3.2, carbs: 5.0, fiber: 0.5, sodium: 180, valueScore: 40.0, nutritionScore: 90 },
  { id: 9, name: '宫保鸡丁饭', category: '荤菜盖饭', canteen: '第二食堂', price: 9.5, calories: 545, protein: 24.0, fat: 19.5, carbs: 65.0, fiber: 2.0, sodium: 820, valueScore: 57.4, nutritionScore: 63 },
  { id: 10, name: '凉拌黄瓜', category: '凉菜', canteen: '第三食堂', price: 2.0, calories: 30, protein: 0.8, fat: 1.5, carbs: 4.0, fiber: 1.0, sodium: 250, valueScore: 15.0, nutritionScore: 85 },
  { id: 11, name: '葱油拌面', category: '面食', canteen: '第一食堂', price: 5.0, calories: 460, protein: 10.0, fat: 16.0, carbs: 70.0, fiber: 2.0, sodium: 680, valueScore: 92.0, nutritionScore: 48 },
  { id: 12, name: '排骨汤', category: '汤类', canteen: '第二食堂', price: 6.0, calories: 180, protein: 15.0, fat: 8.0, carbs: 8.0, fiber: 0, sodium: 420, valueScore: 30.0, nutritionScore: 75 },
]

async function importData() {
  const { error } = await supabase.from('foods').insert(foods)
  if (error) {
    console.error('导入失败:', error)
  } else {
    console.log('导入成功，共插入', foods.length, '条数据')
  }
}

importData()
