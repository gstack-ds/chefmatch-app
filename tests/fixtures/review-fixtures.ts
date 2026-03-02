import { Database } from '../../src/models/database';

type ReviewRow = Database['public']['Tables']['reviews']['Row'];

export const mockReviewRow: ReviewRow = {
  id: 'review-1',
  booking_id: 'booking-1',
  reviewer_id: 'user-123',
  reviewee_id: 'chef-456',
  rating: 5,
  text: 'Incredible meal, highly recommend!',
  created_at: '2026-03-10T00:00:00.000Z',
};

export const mockReviewRow2: ReviewRow = {
  id: 'review-2',
  booking_id: 'booking-2',
  reviewer_id: 'chef-456',
  reviewee_id: 'user-123',
  rating: 4,
  text: 'Great guests, very accommodating.',
  created_at: '2026-03-11T00:00:00.000Z',
};
