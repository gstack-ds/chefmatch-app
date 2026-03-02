import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { Review } from '../models/types';
import { mapReviewRow } from '../utils/mappers';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];

export interface CreateReviewParams {
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  text: string;
}

export async function createReview(params: CreateReviewParams): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      booking_id: params.bookingId,
      reviewer_id: params.reviewerId,
      reviewee_id: params.revieweeId,
      rating: params.rating,
      text: params.text,
    })
    .select()
    .single<ReviewRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create review');
  }

  return mapReviewRow(data);
}

export async function getReviewsForUser(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data as ReviewRow[] ?? []).map(mapReviewRow);
}

export async function getReviewForBooking(
  bookingId: string,
  reviewerId: string,
): Promise<Review | null> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .eq('reviewer_id', reviewerId)
    .maybeSingle<ReviewRow>();

  if (error) throw new Error(error.message);
  if (!data) return null;

  return mapReviewRow(data);
}
