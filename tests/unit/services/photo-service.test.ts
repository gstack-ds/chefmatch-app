const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockRemove = jest.fn();

jest.mock('../../../src/config/supabase', () => ({
  supabase: {
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
      }),
    },
  },
}));

// Mock global fetch for blob conversion
const mockFetch = jest.fn();
global.fetch = mockFetch;

import * as photoService from '../../../src/services/photo-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('uploadPhoto', () => {
  it('uploads image and returns public URL', async () => {
    const mockBlob = new Blob(['image-data'], { type: 'image/jpeg' });
    mockFetch.mockResolvedValue({ blob: () => Promise.resolve(mockBlob) });
    mockUpload.mockResolvedValue({ error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://storage.example.com/chef-photos/chef-456/photo.jpg' },
    });

    const result = await photoService.uploadPhoto(
      'chef-456',
      'file:///local/photo.jpg',
    );

    expect(mockFetch).toHaveBeenCalledWith('file:///local/photo.jpg');
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^chef-456\/.+\.jpg$/),
      mockBlob,
      { contentType: 'image/jpeg', upsert: false },
    );
    expect(result).toBe(
      'https://storage.example.com/chef-photos/chef-456/photo.jpg',
    );
  });

  it('throws on upload error', async () => {
    const mockBlob = new Blob(['image-data']);
    mockFetch.mockResolvedValue({ blob: () => Promise.resolve(mockBlob) });
    mockUpload.mockResolvedValue({ error: { message: 'Storage full' } });

    await expect(
      photoService.uploadPhoto('chef-456', 'file:///local/photo.jpg'),
    ).rejects.toThrow('Storage full');
  });
});

describe('deletePhoto', () => {
  it('removes photo from storage', async () => {
    mockRemove.mockResolvedValue({ error: null });

    await photoService.deletePhoto(
      'chef-456',
      'https://storage.example.com/storage/v1/object/public/chef-photos/chef-456/photo.jpg',
    );

    expect(mockRemove).toHaveBeenCalledWith(['chef-456/photo.jpg']);
  });

  it('throws on invalid URL', async () => {
    await expect(
      photoService.deletePhoto('chef-456', 'https://invalid-url.com/no-bucket'),
    ).rejects.toThrow('Invalid photo URL');
  });

  it('throws on storage removal error', async () => {
    mockRemove.mockResolvedValue({ error: { message: 'File not found' } });

    await expect(
      photoService.deletePhoto(
        'chef-456',
        'https://storage.example.com/storage/v1/object/public/chef-photos/chef-456/photo.jpg',
      ),
    ).rejects.toThrow('File not found');
  });
});
