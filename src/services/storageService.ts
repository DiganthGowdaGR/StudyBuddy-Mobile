import { supabase } from './supabase';

/**
 * Service to manage Supabase Storage Buckets
 */
export const storageService = {
  /**
   * Upload a textbook slide/document to Supabase bucket
   */
  async uploadFile(bucketName: string, pathName: string, fileBody: Blob | ArrayBuffer) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(pathName, fileBody, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) throw error;
    return data;
  },

  /**
   * Get public preview url of uploaded file
   */
  async getPublicUrl(bucketName: string, pathName: string) {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(pathName);

    return data.publicUrl;
  },

  /**
   * List files in specific storage bucket directory
   */
  async listFiles(bucketName: string, folderPath?: string) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(folderPath, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) throw error;
    return data || [];
  },
};
