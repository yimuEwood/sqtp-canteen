export interface FoodItem {
  id: string;
  name: string;
  category: string;
  canteen: string;
  window: string;
  price: number; // grams
  weight: number; // grams
  calories: number; // kcal
  protein: number; // g
  fat: number; // g
  carbs: number; // g
  fiber: number; // g
  sodium: number; // mg
  valueScore: number; // calories per yuan
  nutritionScore: number; // 0-100
  notes: string;
}

export interface Profile {
  id: string;
  email: string;
  role: 'pending' | 'approved' | 'admin';
  created_at: string;
}

export type SortField = keyof FoodItem;
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  category: string;
  canteen: string;
  maxPrice: number;
  minCalories: number;
  maxCalories: number;
  searchQuery: string;
}

// 餐品变更申请
export interface FoodProposal {
  id: string;
  user_id: string;
  action: 'create' | 'update' | 'delete';
  food_id: number | null;
  data: {
    name: string;
    category: string;
    canteen: string;
    window: string;
    price: number;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
    sodium: number;
    nutritionScore: number;
    valueScore: number;
  } | Record<string, never>; // delete 时为空对象 {}
  status: 'pending' | 'approved' | 'rejected';
  admin_note: string | null;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}
