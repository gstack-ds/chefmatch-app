import { supabase } from '../config/supabase';

export async function uploadPhoto(
  userId: string,
  imageUri: string,
): Promise<string> {
  const fileExt = 'jpg';
  const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

  // Read the file as a blob for upload
  const response = await fetch(imageUri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from('chef-photos')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from('chef-photos')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deletePhoto(
  userId: string,
  photoUrl: string,
): Promise<void> {
  // Extract the file path from the public URL
  // URL format: .../storage/v1/object/public/chef-photos/{userId}/{filename}
  const bucketPath = photoUrl.split('/chef-photos/')[1];
  if (!bucketPath) {
    throw new Error('Invalid photo URL');
  }

  const { error } = await supabase.storage
    .from('chef-photos')
    .remove([bucketPath]);

  if (error) throw new Error(error.message);
}
