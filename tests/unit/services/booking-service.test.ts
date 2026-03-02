import { mockBookingRowPending, mockBookingRowConfirmed } from '../../fixtures/booking-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as bookingService from '../../../src/services/booking-service';
import { BookingStatus } from '../../../src/config/constants';

function mockInsertChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.insert = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockSelectSingleChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.single = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockSelectListChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.select = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.order = jest.fn().mockResolvedValue({ data, error });
  return chain;
}

function mockUpdateChain(error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.update = jest.fn().mockReturnValue(chain);
  chain.eq = jest.fn().mockResolvedValue({ error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('createBooking', () => {
  it('inserts a booking and returns mapped result', async () => {
    mockFrom.mockImplementation(() => mockInsertChain(mockBookingRowPending));

    const result = await bookingService.createBooking({
      consumerId: 'consumer-profile-1',
      chefId: 'chef-profile-1',
      conversationId: 'conversation-1',
      serviceModel: 'full_service',
      eventDate: '2026-04-15T18:00:00.000Z',
      partySize: 4,
      occasion: 'Anniversary Dinner',
      specialRequests: 'Nut-free, please.',
      groceryArrangement: 'chef_provides',
      locationAddress: '123 Main St, Los Angeles, CA',
    });

    expect(result.id).toBe('booking-1');
    expect(result.consumerId).toBe('consumer-profile-1');
    expect(result.status).toBe('pending');
    expect(result.partySize).toBe(4);
    expect(mockFrom).toHaveBeenCalledWith('bookings');
  });

  it('throws on insert error', async () => {
    mockFrom.mockImplementation(() =>
      mockInsertChain(null, { message: 'Insert failed' }),
    );

    await expect(
      bookingService.createBooking({
        consumerId: 'c1',
        chefId: 'ch1',
        conversationId: null,
        serviceModel: 'full_service',
        eventDate: '2026-04-15T18:00:00.000Z',
        partySize: 2,
        occasion: '',
        specialRequests: '',
        groceryArrangement: 'chef_provides',
        locationAddress: null,
      }),
    ).rejects.toThrow('Insert failed');
  });
});

describe('getBooking', () => {
  it('returns a single booking by ID', async () => {
    mockFrom.mockImplementation(() => mockSelectSingleChain(mockBookingRowPending));

    const result = await bookingService.getBooking('booking-1');

    expect(result.id).toBe('booking-1');
    expect(result.occasion).toBe('Anniversary Dinner');
    expect(mockFrom).toHaveBeenCalledWith('bookings');
  });

  it('throws when booking not found', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectSingleChain(null, { message: 'Not found' }),
    );

    await expect(bookingService.getBooking('nonexistent')).rejects.toThrow('Not found');
  });
});

describe('getBookingsForConsumer', () => {
  it('returns bookings for a consumer', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain([mockBookingRowPending, mockBookingRowConfirmed]),
    );

    const result = await bookingService.getBookingsForConsumer('consumer-profile-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('booking-1');
    expect(result[1].id).toBe('booking-2');
    expect(mockFrom).toHaveBeenCalledWith('bookings');
  });

  it('returns empty array when no bookings', async () => {
    mockFrom.mockImplementation(() => mockSelectListChain([]));

    const result = await bookingService.getBookingsForConsumer('consumer-profile-1');

    expect(result).toEqual([]);
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain(null, { message: 'Query failed' }),
    );

    await expect(
      bookingService.getBookingsForConsumer('consumer-profile-1'),
    ).rejects.toThrow('Query failed');
  });
});

describe('getBookingsForChef', () => {
  it('returns bookings for a chef', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain([mockBookingRowPending]),
    );

    const result = await bookingService.getBookingsForChef('chef-profile-1');

    expect(result).toHaveLength(1);
    expect(result[0].chefId).toBe('chef-profile-1');
    expect(mockFrom).toHaveBeenCalledWith('bookings');
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain(null, { message: 'Query failed' }),
    );

    await expect(
      bookingService.getBookingsForChef('chef-profile-1'),
    ).rejects.toThrow('Query failed');
  });
});

describe('updateBookingStatus', () => {
  it('updates booking status', async () => {
    mockFrom.mockImplementation(() => mockUpdateChain());

    await bookingService.updateBookingStatus('booking-1', BookingStatus.CONFIRMED);

    expect(mockFrom).toHaveBeenCalledWith('bookings');
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() => mockUpdateChain({ message: 'Update failed' }));

    await expect(
      bookingService.updateBookingStatus('booking-1', BookingStatus.CONFIRMED),
    ).rejects.toThrow('Update failed');
  });
});
