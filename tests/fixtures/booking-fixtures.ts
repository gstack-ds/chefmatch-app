import { Database } from '../../src/models/database';

type BookingRow = Database['public']['Tables']['bookings']['Row'];

export const mockBookingRowPending: BookingRow = {
  id: 'booking-1',
  consumer_id: 'consumer-profile-1',
  chef_id: 'chef-profile-1',
  conversation_id: 'conversation-1',
  status: 'pending',
  service_model: 'full_service',
  event_date: '2026-04-15T18:00:00.000Z',
  party_size: 4,
  occasion: 'Anniversary Dinner',
  special_requests: 'Nut-free, please.',
  grocery_arrangement: 'chef_provides',
  total_price: null,
  location_address: '123 Main St, Los Angeles, CA',
  location_latitude: 34.0522,
  location_longitude: -118.2437,
  created_at: '2026-03-01T00:00:00.000Z',
  updated_at: '2026-03-01T00:00:00.000Z',
};

export const mockBookingRowConfirmed: BookingRow = {
  id: 'booking-2',
  consumer_id: 'consumer-profile-1',
  chef_id: 'chef-profile-1',
  conversation_id: 'conversation-1',
  status: 'confirmed',
  service_model: 'collaborative',
  event_date: '2026-04-20T19:00:00.000Z',
  party_size: 6,
  occasion: 'Birthday Party',
  special_requests: '',
  grocery_arrangement: 'split',
  total_price: 450,
  location_address: '456 Oak Ave, Los Angeles, CA',
  location_latitude: 34.06,
  location_longitude: -118.25,
  created_at: '2026-03-02T00:00:00.000Z',
  updated_at: '2026-03-03T00:00:00.000Z',
};
