import { supabaseServer } from '../supabaseServer';

export interface Review {
  id: string;
  body: string;
  author_name: string;
  source_text: string | null;
  source_url: string | null;
  author_image_url: string | null;
  review_image_url: string | null;
}

export async function listReviews(): Promise<Review[]> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from('reviews')
    .select('id, body, author_name, source_text, source_url, author_image_url, review_image_url')
    .order('id', { ascending: true });

  if (error) {
    console.error('Supabase listReviews error:', error);
    return [];
  }
  return (data ?? []) as Review[];
}
