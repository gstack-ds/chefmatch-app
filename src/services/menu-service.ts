import { supabase } from '../config/supabase';
import { Database } from '../models/database';
import { MenuItem } from '../models/types';
import { mapMenuItemRow } from '../utils/mappers';

type MenuItemRow = Database['public']['Tables']['menu_items']['Row'];
type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert'];
type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update'];

export async function getMenuItems(chefId: string): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('chef_id', chefId)
    .order('sort_order', { ascending: true });

  if (error) throw new Error(error.message);

  return (data as MenuItemRow[]).map(mapMenuItemRow);
}

export async function createMenuItem(item: MenuItemInsert): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert(item)
    .select()
    .single<MenuItemRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create menu item');
  }

  return mapMenuItemRow(data);
}

export async function updateMenuItem(
  id: string,
  updates: Partial<MenuItemUpdate>,
): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
