import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { BookingStatus } from '../config/constants';
import { Booking } from '../models/types';
import { mapBookingRow } from '../utils/mappers';

type BookingRow = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export interface CreateBookingParams {
  consumerId: string;
  chefId: string;
  conversationId: string | null;
  serviceModel: string;
  eventDate: string;
  partySize: number;
  occasion: string;
  specialRequests: string;
  groceryArrangement: string;
  locationAddress: string | null;
}

export async function createBooking(params: CreateBookingParams): Promise<Booking> {
  const insert: BookingInsert = {
    consumer_id: params.consumerId,
    chef_id: params.chefId,
    conversation_id: params.conversationId,
    service_model: params.serviceModel as BookingInsert['service_model'],
    event_date: params.eventDate,
    party_size: params.partySize,
    occasion: params.occasion,
    special_requests: params.specialRequests,
    grocery_arrangement: params.groceryArrangement as BookingInsert['grocery_arrangement'],
    location_address: params.locationAddress,
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(insert)
    .select()
    .single<BookingRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create booking');
  }

  return mapBookingRow(data);
}

export async function getBooking(bookingId: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single<BookingRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Booking not found');
  }

  return mapBookingRow(data);
}

export async function getBookingsForConsumer(consumerId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data as BookingRow[] ?? []).map(mapBookingRow);
}

export async function getBookingsForChef(chefId: string): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('chef_id', chefId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data as BookingRow[] ?? []).map(mapBookingRow);
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<void> {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw new Error(error.message);
}
