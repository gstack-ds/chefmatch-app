import { mapUserRow } from '../../../src/utils/mappers';
import { mockUserRow, mockChefUserRow } from '../../fixtures/auth-fixtures';

describe('mapUserRow', () => {
  it('maps a consumer user row to UserProfile', () => {
    const result = mapUserRow(mockUserRow);

    expect(result).toEqual({
      id: 'user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'consumer',
      avatarUrl: null,
      phone: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('maps a chef user row to UserProfile', () => {
    const result = mapUserRow(mockChefUserRow);

    expect(result).toEqual({
      id: 'chef-456',
      email: 'chef@example.com',
      displayName: 'Test Chef',
      role: 'chef',
      avatarUrl: 'https://example.com/avatar.jpg',
      phone: '+1234567890',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('converts snake_case keys to camelCase', () => {
    const result = mapUserRow(mockUserRow);

    expect(result).toHaveProperty('displayName');
    expect(result).toHaveProperty('avatarUrl');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result).not.toHaveProperty('display_name');
    expect(result).not.toHaveProperty('avatar_url');
    expect(result).not.toHaveProperty('created_at');
    expect(result).not.toHaveProperty('updated_at');
  });
});
