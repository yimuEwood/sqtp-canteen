import { pb } from './lib/pocketbase';

const foods = [
  { name: '红烧肉饭', category: '荤菜盖饭', canteen: '大食堂', area: '风味', window: '荤菜窗口', price: 8, weight: 350, calories: 520, protein: 18.5, fat: 22, carbs: 62, fiber: 1.2, sodium: 680, valueScore: 65, nutritionScore: 58, notes: '含较多饱和脂肪，米饭约200g' },
  { name: '清炒时蔬', category: '素菜', canteen: '大食堂', area: '风味', window: '素菜窗口', price: 3, weight: 150, calories: 75, protein: 2.1, fat: 4.5, carbs: 7.8, fiber: 2.8, sodium: 320, valueScore: 25, nutritionScore: 82, notes: '当季蔬菜，低热量高膳食纤维' },
  { name: '水煮鱼片', category: '荤菜', canteen: '大食堂', area: '东区', window: '特色窗口', price: 12, weight: 280, calories: 340, protein: 28, fat: 18.5, carbs: 12, fiber: 0.8, sodium: 920, valueScore: 28.3, nutritionScore: 71, notes: '高蛋白，含辣椒素，钠含量偏高' },
  { name: '番茄鸡蛋面', category: '面食', canteen: '大食堂', area: '东区', window: '面食窗口', price: 7, weight: 400, calories: 415, protein: 14.2, fat: 9.8, carbs: 68.5, fiber: 2.5, sodium: 560, valueScore: 59.3, nutritionScore: 74, notes: '番茄维C丰富，碳水比例较高' },
  { name: '蒸蛋羹', category: '蛋类', canteen: '大食堂', area: '风味', window: '早餐窗口', price: 2.5, weight: 120, calories: 130, protein: 10.8, fat: 8.2, carbs: 2.5, fiber: 0, sodium: 280, valueScore: 52, nutritionScore: 88, notes: '优质蛋白，易消化，适合早餐' },
  { name: '卤鸡腿饭', category: '荤菜盖饭', canteen: '大食堂', area: '西区', window: '卤味窗口', price: 10, weight: 380, calories: 580, protein: 32, fat: 16.5, carbs: 70, fiber: 1.8, sodium: 750, valueScore: 58, nutritionScore: 65, notes: '蛋白质丰富，热量适中' },
  { name: '麻辣烫（素）', category: '汤类/火锅', canteen: '银泉', area: '速选', window: '麻辣烫窗口', price: 9, weight: 450, calories: 390, protein: 12.5, fat: 14, carbs: 55, fiber: 5.2, sodium: 1100, valueScore: 43.3, nutritionScore: 55, notes: '蔬菜多样，但钠含量极高需注意' },
  { name: '豆腐脑', category: '豆制品', canteen: '大食堂', area: '民族', window: '早餐窗口', price: 2, weight: 250, calories: 80, protein: 8.5, fat: 3.2, carbs: 5, fiber: 0.5, sodium: 180, valueScore: 40, nutritionScore: 90, notes: '优质植物蛋白，低热量，适合减脂' },
  { name: '宫保鸡丁饭', category: '荤菜盖饭', canteen: '大食堂', area: '休闲', window: '热菜窗口', price: 9.5, weight: 370, calories: 545, protein: 24, fat: 19.5, carbs: 65, fiber: 2, sodium: 820, valueScore: 57.4, nutritionScore: 63, notes: '花生含健康脂肪，辣椒促进代谢' },
  { name: '凉拌黄瓜', category: '凉菜', canteen: '银泉', area: '食天一隅', window: '凉菜窗口', price: 2, weight: 100, calories: 30, protein: 0.8, fat: 1.5, carbs: 4, fiber: 1, sodium: 250, valueScore: 15, nutritionScore: 85, notes: '低热量解腻，富含水分和维生素' },
  { name: '葱油拌面', category: '面食', canteen: '大食堂', area: '西区', window: '面食窗口', price: 5, weight: 300, calories: 460, protein: 10, fat: 16, carbs: 70, fiber: 2, sodium: 680, valueScore: 92, nutritionScore: 48, notes: '碳水高，蛋白质偏低，性价比高' },
  { name: '排骨汤', category: '汤类', canteen: '澄月', area: '一楼', window: '汤类窗口', price: 6, weight: 300, calories: 180, protein: 15, fat: 8, carbs: 8, fiber: 0, sodium: 420, valueScore: 30, nutritionScore: 75, notes: '骨汤含钙，蛋白质丰富，低碳水' },
];

async function importFoods() {
  // 先清空已有数据
  try {
    const existing = await pb.collection('foods').getFullList();
    for (const item of existing) {
      await pb.collection('foods').delete(item.id);
    }
  } catch (e) {
    console.log('无需清空或清空失败:', e);
  }

  // 导入新数据
  for (const f of foods) {
    try {
      await pb.collection('foods').create(f);
      console.log(`✅ 已导入: ${f.name}`);
    } catch (e: any) {
      console.error(`❌ 导入失败: ${f.name}`, e.message);
    }
  }
  console.log('🎉 导入完成');
}

importFoods();
