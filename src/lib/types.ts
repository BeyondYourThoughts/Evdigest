export type Segment = '2W' | '3W' | 'Cars' | 'Commercial';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  segment: Segment;
  tagline: string | null;
  founded_year: number | null;
  hq_city: string | null;
  vehicle_count: number;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  charging_network_info: string | null;
}

export interface Vehicle {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  segment: Segment;
  price_inr: number | null;
  range_km: number | null;
  battery_kwh: number | null;
  charge_time_hrs: string | null;
  top_speed_kmph: number | null;
  seating: number | null;
  image_url: string | null;
  rating: number;
  pros: string[];
  cons: string[];
  review_excerpt: string | null;
  body_type: string | null;
  launch_date: string | null;
}

export interface VehicleWithBrand extends Vehicle {
  brand?: Pick<Brand, 'name' | 'slug'>;
}

export type ArticleCategory =
  | 'news' | 'industry' | 'battery' | 'charging'
  | 'consumer' | 'interview' | 'opinion' | 'investment'
  | 'events' | 'magazine';

export type ArticleSection =
  | 'consumers' | 'industry' | 'events' | 'basics' | 'magazine';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: ArticleCategory;
  section: ArticleSection;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  author: string | null;
  author_role: string | null;
  read_time_min: number;
  published_at: string;
  tags: string[];
  is_featured: boolean;
  is_breaking: boolean;
  view_count: number;
  brand_id: string | null;
}

export interface Review {
  id: string;
  vehicle_id: string;
  title: string;
  slug: string;
  review_type: 'expert' | 'owner' | 'long-term' | 'video';
  rating: number;
  excerpt: string | null;
  body: string | null;
  author: string | null;
  author_role: string | null;
  pros: string[];
  cons: string[];
  rating_breakdown: Record<string, number> | null;
  image_url: string | null;
  published_at: string;
}

export interface ReviewWithVehicle extends Review {
  vehicle?: Pick<Vehicle, 'name' | 'slug' | 'image_url'>;
}

export interface EVEvent {
  id: string;
  name: string;
  slug: string;
  type: 'expo' | 'conference' | 'webinar' | 'recap';
  start_date: string;
  end_date: string | null;
  city: string | null;
  venue: string | null;
  description: string | null;
  image_url: string | null;
  registration_url: string | null;
  is_featured: boolean;
  is_past: boolean;
}

export interface OwnerStory {
  id: string;
  author_name: string;
  vehicle: string;
  brand: string | null;
  city: string | null;
  use_case: string;
  headline: string | null;
  story_text: string | null;
  photo_url: string | null;
  submitted_at: string;
  is_featured: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string | null;
}

export interface EVSalesData {
  id: string;
  month: string;
  year: number;
  segment: string;
  units_sold: number;
  source: string;
}
