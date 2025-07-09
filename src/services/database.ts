import {
  supabase,
} from '../lib/supabase';
import type {
  Store,
  Product,
  SearchAnalytic,
  PopularProduct,
} from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

class DatabaseService {
  private userSession: string;

  constructor() {
    this.userSession = this.getUserSession();
  }

  private getUserSession(): string {
    let session = localStorage.getItem('amacity_session');
    if (!session) {
      session = uuidv4();
      localStorage.setItem('amacity_session', session);
    }
    return session;
  }

  // STORES
  async getStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching stores:', error);
      return [];
    }
    return data || [];
  }

  async getStore(id: number): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching store:', error);
      return null;
    }
    return data;
  }

  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        stores (
          name,
          address,
          rating
        )
      `
      )
      .eq('in_stock', true)
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (
      data?.map((product) => ({
        ...product,
        store_name: product.stores?.name,
        store_address: product.stores?.address,
        store_rating: product.stores?.rating,
      })) || []
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from('products')
      .select(
        `
        *,
        stores (
          name,
          address,
          rating
        )
      `
      )
      .or(`name.ilike.%${query}%,category.ilike.%${query}%,tags.cs.{${query}}`)
      .eq('in_stock', true)
      .limit(20);

    if (error) {
      console.error('Error searching products:', error);
      return [];
    }

    // Track search
    await this.trackSearch(query);

    return (
      data?.map((product) => ({
        ...product,
        store_name: product.stores?.name,
        store_address: product.stores?.address,
        store_rating: product.stores?.rating,
      })) || []
    );
  }

  async getProductsByStore(storeId: number): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('in_stock', true)
      .order('name');

    if (error) {
      console.error('Error fetching store products:', error);
      return [];
    }
    return data || [];
  }

  // ANALYTICS
  async trackSearch(
    searchTerm: string,
    productId?: number,
    storeId?: number
  ): Promise<void> {
    const { error } = await supabase.from('search_analytics').insert({
      search_term: searchTerm,
      product_id: productId,
      store_id: storeId,
      user_session: this.userSession,
      clicked: false,
    });

    if (error) {
      console.error('Error tracking search:', error);
    }
  }

  async trackProductClick(
    productId: number,
    searchTerm: string
  ): Promise<void> {
    // Update the most recent search for this session and product
    const { error } = await supabase
      .from('search_analytics')
      .update({ clicked: true })
      .eq('user_session', this.userSession)
      .eq('product_id', productId)
      .eq('search_term', searchTerm)
      .order('search_timestamp', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error tracking click:', error);
    }

    // Increment product search count
    const { error: updateError } = await supabase
      .from('products')
      .update({ search_count: supabase.sql`search_count + 1` })
      .eq('id', productId);

    if (updateError) {
      console.error('Error updating product search count:', updateError);
    }
  }

  async getPopularProductsByStore(): Promise<Record<number, PopularProduct[]>> {
    const { data, error } = await supabase
      .from('store_popular_products')
      .select('*')
      .limit(5); // Top 5 per store

    if (error) {
      console.error('Error fetching popular products:', error);
      return {};
    }

    // Group by store_id
    const grouped: Record<number, PopularProduct[]> = {};
    data?.forEach((item) => {
      if (!grouped[item.store_id]) {
        grouped[item.store_id] = [];
      }
      grouped[item.store_id].push(item);
    });

    return grouped;
  }

  async getSearchTrends(
    days: number = 7
  ): Promise<Array<{ date: string; searches: number }>> {
    const { data, error } = await supabase
      .from('search_analytics')
      .select('search_timestamp')
      .gte(
        'search_timestamp',
        new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      )
      .order('search_timestamp');

    if (error) {
      console.error('Error fetching search trends:', error);
      return [];
    }

    // Group by date
    const grouped: Record<string, number> = {};
    data?.forEach((item) => {
      const date = new Date(item.search_timestamp).toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, searches]) => ({
      date,
      searches,
    }));
  }
}

export const db = new DatabaseService();
