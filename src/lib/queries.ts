import { supabase } from './supabase';
import type {
  Article, Brand, Vehicle, VehicleWithBrand,
  Review, ReviewWithVehicle, EVEvent, OwnerStory, GlossaryTerm, EVSalesData,
} from './types';

export async function getBreakingNews(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(5);
  if (error) throw error;
  return data as Article[];
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Article[];
}

export async function getLatestArticles(limit = 10, section?: string): Promise<Article[]> {
  let q = supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (section) q = q.eq('section', section);
  const { data, error } = await q;
  if (error) throw error;
  return data as Article[];
}

export async function getArticlesByCategory(category: string, limit = 20): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Article[];
}

export async function getArticlesBySection(section: string, limit = 20): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('section', section)
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Article | null;
}

export async function searchArticles(query: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,tags.cs.{${query}}`)
    .order('published_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data as Article[];
}

export async function getBrands(segment?: string): Promise<Brand[]> {
  let q = supabase.from('brands').select('*').order('name', { ascending: true });
  if (segment) q = q.eq('segment', segment);
  const { data, error } = await q;
  if (error) throw error;
  return data as Brand[];
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Brand | null;
}

export async function getVehicles(segment?: string): Promise<VehicleWithBrand[]> {
  let q = supabase
    .from('vehicles')
    .select('*, brand:brands(name, slug)')
    .order('rating', { ascending: false });
  if (segment) q = q.eq('segment', segment);
  const { data, error } = await q;
  if (error) throw error;
  return data as VehicleWithBrand[];
}

export async function getVehiclesByBrand(brandId: string): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('brand_id', brandId)
    .order('name', { ascending: true });
  if (error) throw error;
  return data as Vehicle[];
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Vehicle | null;
}

export async function getVehicleByIds(ids: string[]): Promise<VehicleWithBrand[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, brand:brands(name, slug)')
    .in('id', ids);
  if (error) throw error;
  return data as VehicleWithBrand[];
}

export async function getReviews(type?: string): Promise<ReviewWithVehicle[]> {
  let q = supabase
    .from('reviews')
    .select('*, vehicle:vehicles(name, slug, image_url)')
    .order('published_at', { ascending: false });
  if (type) q = q.eq('review_type', type);
  const { data, error } = await q;
  if (error) throw error;
  return data as ReviewWithVehicle[];
}

export async function getReviewBySlug(slug: string): Promise<ReviewWithVehicle | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, vehicle:vehicles(name, slug, image_url)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as ReviewWithVehicle | null;
}

export async function getReviewsByVehicle(vehicleId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data as Review[];
}

export async function getEvents(upcomingOnly = false): Promise<EVEvent[]> {
  let q = supabase.from('events').select('*').order('start_date', { ascending: true });
  if (upcomingOnly) q = q.eq('is_past', false);
  const { data, error } = await q;
  if (error) throw error;
  return data as EVEvent[];
}

export async function getFeaturedEvent(): Promise<EVEvent | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_featured', true)
    .maybeSingle();
  if (error) throw error;
  return data as EVEvent | null;
}

export async function getEventsByType(type: string): Promise<EVEvent[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('type', type)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data as EVEvent[];
}

export async function getOwnerStories(featuredOnly = false): Promise<OwnerStory[]> {
  let q = supabase
    .from('owner_stories')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (featuredOnly) q = q.eq('is_featured', true);
  const { data, error } = await q;
  if (error) throw error;
  return data as OwnerStory[];
}

export async function submitOwnerStory(story: Partial<OwnerStory>): Promise<void> {
  const { error } = await supabase.from('owner_stories').insert(story);
  if (error) throw error;
}

export async function getGlossaryTerms(): Promise<GlossaryTerm[]> {
  const { data, error } = await supabase
    .from('glossary_terms')
    .select('*')
    .order('term', { ascending: true });
  if (error) throw error;
  return data as GlossaryTerm[];
}

export async function getSalesData(): Promise<EVSalesData[]> {
  const { data, error } = await supabase
    .from('ev_sales_data')
    .select('*')
    .order('year', { ascending: true })
    .order('month', { ascending: true });
  if (error) throw error;
  return data as EVSalesData[];
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from('contact_submissions').insert(data);
  if (error) throw error;
}
