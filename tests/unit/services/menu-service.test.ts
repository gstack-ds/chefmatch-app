import { mockMenuItemRow, mockMenuItemRow2 } from '../../fixtures/chef-fixtures';

const mockFrom = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}));

import * as menuService from '../../../src/services/menu-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getMenuItems', () => {
  it('fetches and maps all menu items for a chef', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: [mockMenuItemRow, mockMenuItemRow2],
        error: null,
      }),
    };
    mockFrom.mockReturnValue(chain);

    const result = await menuService.getMenuItems('chef-profile-1');

    expect(mockFrom).toHaveBeenCalledWith('menu_items');
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('Truffle Risotto');
    expect(result[1].name).toBe('Pan-Seared Salmon');
    expect(result[0].chefId).toBe('chef-profile-1');
  });

  it('returns empty array when no items exist', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    };
    mockFrom.mockReturnValue(chain);

    const result = await menuService.getMenuItems('chef-profile-1');
    expect(result).toEqual([]);
  });

  it('throws on fetch error', async () => {
    const chain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      }),
    };
    mockFrom.mockReturnValue(chain);

    await expect(menuService.getMenuItems('bad-id')).rejects.toThrow(
      'Query failed',
    );
  });
});

describe('createMenuItem', () => {
  it('inserts and returns the new menu item', async () => {
    const chain = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockMenuItemRow,
        error: null,
      }),
    };
    mockFrom.mockReturnValue(chain);

    const result = await menuService.createMenuItem({
      chef_id: 'chef-profile-1',
      name: 'Truffle Risotto',
      price: 45,
    });

    expect(result.name).toBe('Truffle Risotto');
    expect(result.price).toBe(45);
  });

  it('throws on insert error', async () => {
    const chain = {
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Duplicate name' },
      }),
    };
    mockFrom.mockReturnValue(chain);

    await expect(
      menuService.createMenuItem({
        chef_id: 'chef-profile-1',
        name: 'Duplicate',
        price: 10,
      }),
    ).rejects.toThrow('Duplicate name');
  });
});

describe('updateMenuItem', () => {
  it('updates menu item fields', async () => {
    const chain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    mockFrom.mockReturnValue(chain);

    await menuService.updateMenuItem('menu-item-1', {
      name: 'Updated Name',
      price: 50,
    });

    expect(chain.update).toHaveBeenCalledWith({
      name: 'Updated Name',
      price: 50,
    });
  });

  it('throws on update error', async () => {
    const chain = {
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: { message: 'Update failed' },
      }),
    };
    mockFrom.mockReturnValue(chain);

    await expect(
      menuService.updateMenuItem('menu-item-1', { name: 'Fail' }),
    ).rejects.toThrow('Update failed');
  });
});

describe('deleteMenuItem', () => {
  it('deletes a menu item', async () => {
    const chain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    };
    mockFrom.mockReturnValue(chain);

    await menuService.deleteMenuItem('menu-item-1');

    expect(mockFrom).toHaveBeenCalledWith('menu_items');
    expect(chain.delete).toHaveBeenCalled();
  });

  it('throws on delete error', async () => {
    const chain = {
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({
        error: { message: 'Delete failed' },
      }),
    };
    mockFrom.mockReturnValue(chain);

    await expect(menuService.deleteMenuItem('menu-item-1')).rejects.toThrow(
      'Delete failed',
    );
  });
});
