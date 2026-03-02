import { mockMessageRow, mockMessageRow2, mockConversationRowWithJoin } from '../../fixtures/message-fixtures';

const mockFrom = jest.fn();
const mockChannelInstance = {
  on: jest.fn().mockReturnThis(),
  subscribe: jest.fn().mockReturnThis(),
  unsubscribe: jest.fn(),
};
const mockChannelFn = jest.fn().mockReturnValue(mockChannelInstance);

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
    channel: (...args: unknown[]) => mockChannelFn(...args),
  },
}));

import * as messageService from '../../../src/services/message-service';

function mockInsertChain(data: unknown, error: unknown = null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Record<string, any> = {};
  chain.insert = jest.fn().mockReturnValue(chain);
  chain.select = jest.fn().mockReturnValue(chain);
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
  chain.eq = jest.fn().mockReturnValue(chain);
  chain.is = jest.fn().mockResolvedValue({ error });
  return chain;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getMessages', () => {
  it('returns messages for a conversation ordered by created_at', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain([mockMessageRow, mockMessageRow2]),
    );

    const result = await messageService.getMessages('conversation-1');

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('message-1');
    expect(result[0].content).toBe('Hello, Chef Marco!');
    expect(result[1].id).toBe('message-2');
    expect(mockFrom).toHaveBeenCalledWith('messages');
  });

  it('returns empty array when no messages', async () => {
    mockFrom.mockImplementation(() => mockSelectListChain([]));

    const result = await messageService.getMessages('conversation-1');

    expect(result).toEqual([]);
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() =>
      mockSelectListChain(null, { message: 'Query failed' }),
    );

    await expect(messageService.getMessages('conversation-1')).rejects.toThrow('Query failed');
  });
});

describe('sendMessage', () => {
  it('inserts a message and returns mapped result', async () => {
    mockFrom.mockImplementation(() => mockInsertChain(mockMessageRow));

    const result = await messageService.sendMessage('conversation-1', 'user-123', 'Hello, Chef Marco!');

    expect(result.id).toBe('message-1');
    expect(result.conversationId).toBe('conversation-1');
    expect(result.senderId).toBe('user-123');
    expect(result.content).toBe('Hello, Chef Marco!');
    expect(mockFrom).toHaveBeenCalledWith('messages');
  });

  it('throws on insert error', async () => {
    mockFrom.mockImplementation(() =>
      mockInsertChain(null, { message: 'Insert failed' }),
    );

    await expect(
      messageService.sendMessage('conversation-1', 'user-123', 'Hello'),
    ).rejects.toThrow('Insert failed');
  });
});

describe('markAsRead', () => {
  it('updates read_at for unread messages', async () => {
    mockFrom.mockImplementation(() => mockUpdateChain());

    await messageService.markAsRead('message-1');

    expect(mockFrom).toHaveBeenCalledWith('messages');
  });

  it('throws on error', async () => {
    mockFrom.mockImplementation(() => mockUpdateChain({ message: 'Update failed' }));

    await expect(messageService.markAsRead('message-1')).rejects.toThrow('Update failed');
  });
});

describe('subscribeToMessages', () => {
  it('creates a realtime channel subscription', () => {
    const onNewMessage = jest.fn();

    const channel = messageService.subscribeToMessages('conversation-1', onNewMessage);

    expect(mockChannelFn).toHaveBeenCalledWith('messages:conversation-1');
    expect(mockChannelInstance.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: 'conversation_id=eq.conversation-1',
      }),
      expect.any(Function),
    );
    expect(mockChannelInstance.subscribe).toHaveBeenCalled();
    expect(channel).toBe(mockChannelInstance);
  });
});

describe('getConversationsForUser', () => {
  it('returns conversations with other user names', async () => {
    // Mock the conversations query
    const conversationsChain = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [mockConversationRowWithJoin], error: null }),
    };

    // Mock the last message query
    const messagesChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [{ content: 'Hello!', created_at: '2026-03-02T10:00:00.000Z' }],
        error: null,
      }),
    };

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      if (callCount === 1) return conversationsChain;
      return messagesChain;
    });

    const result = await messageService.getConversationsForUser('user-123');

    expect(result).toHaveLength(1);
    expect(result[0].otherUserName).toBe('Chef Marco');
    expect(result[0].lastMessage).toBe('Hello!');
  });

  it('throws on error', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: null, error: { message: 'Query failed' } }),
    };
    mockFrom.mockImplementation(() => chain);

    await expect(
      messageService.getConversationsForUser('user-123'),
    ).rejects.toThrow('Query failed');
  });
});
