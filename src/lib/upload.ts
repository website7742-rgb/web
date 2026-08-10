import { uploadToR2 } from '@/actions/storageActions';

export const uploadArtistImage = async (file: File, pathFolder: string): Promise<string | null> => {
  return uploadMedia(file, pathFolder);
};

export const uploadMedia = async (file: File, pathFolder: string): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pathFolder', pathFolder);

    const result = await uploadToR2(formData);
    
    if (result.success && result.data?.url) {
      return result.data.url;
    } else {
      console.error('Failed to upload to R2:', result.message);
      return null;
    }
  } catch (err) {
    console.error('Failed to upload to Cloudflare R2:', err);
    return null;
  }
};
