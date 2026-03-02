import { Database } from '../models/database';
import { UserProfile } from '../models/types';

type UserRow = Database['public']['Tables']['users']['Row'];

export function mapUserRow(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    avatarUrl: row.avatar_url,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
