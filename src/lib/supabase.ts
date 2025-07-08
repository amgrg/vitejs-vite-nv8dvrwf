import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjsjruvqxolezscvqzub.supabase.co'; // Sostituisci con il tuo URL
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqc2pydXZxeG9sZXpzY3ZxenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMDEwMjMsImV4cCI6MjA2NzU3NzAyM30.gnIL58TAWVExtmICDC0F_Mf7mXeK-DOM9YKKkYHzT60'; // Sostituisci con la tua chiave

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types
export interface Store {
  id: number;
  name: string;
  email: string;
  description: string;
  address: string;
  phone?: string;
  category: string;
  rating: number;
  is_open: boolean;
  delivery_time: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  store_id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  in_stock: boolean;
  tags: string[];
  image_url?: string;
  search_count: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  store_name?: string;
  store_address?: string;
  store_rating?: number;
}

export interface SearchAnalytic {
  id: number;
  search_term: string;
  product_id?: number;
  store_id?: number;
  user_session: string;
  clicked: boolean;
  search_timestamp: string;
}

export interface PopularProduct {
  store_id: number;
  store_name: string;
  product_id: number;
  product_name: string;
  category: string;
  price: number;
  search_count: number;
  click_count: number;
}
