import { createClient } from '@supabase/supabase-js'
import { FoodItem } from '../types'

const supabaseUrl = 'https://imewztdgharjzcrwibsa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltZXd6dGRnaGFyanpjcndpYnNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMjA5ODksImV4cCI6MjA5Mzg5Njk4OX0.ziqQpYPyn-a0puw6aKE4g5ksVgv2t3AIZHtWQ0comE4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type { FoodItem }
