
import { z } from 'zod';

const API_VERSION = 'v19.0';
const BASE_URL = `https://graph.facebook.com/${API_VERSION}`;

const igMediaSchema = z.object({
  id: z.string(),
  media_type: z.enum(['IMAGE', 'VIDEO', 'CAROUSEL_ALBUM']),
  media_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  caption: z.string().optional(),
  timestamp: z.string().datetime(),
  like_count: z.number().optional(),
  comments_count: z.number().optional(),
});
export type InstagramMedia = z.infer<typeof igMediaSchema>;

const igProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  followers_count: z.number().optional(),
  profile_picture_url: z.string().url().optional(),
  account_type: z.enum(['BUSINESS', 'MEDIA_CREATOR', 'PERSONAL']),
});
export type InstagramProfile = z.infer<typeof igProfileSchema>;


class InstagramApiError extends Error {
  constructor(message: string, public status: number, public details?: any) {
    super(message);
    this.name = 'InstagramApiError';
  }
}

async function fetcher(url: string) {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data.error?.message || 'An unknown error occurred with the Instagram API.';
    throw new InstagramApiError(errorMessage, response.status, data.error);
  }

  return data;
}

export const getInstagramProfile = async (igUserId: string, accessToken: string): Promise<InstagramProfile> => {
  const fields = 'id,username,followers_count,profile_picture_url,account_type';
  const url = `${BASE_URL}/${igUserId}?fields=${fields}&access_token=${accessToken}`;
  const data = await fetcher(url);
  return igProfileSchema.parse(data);
};

export const getInstagramMedia = async (igUserId: string, accessToken: string, limit = 20): Promise<{ data: InstagramMedia[] }> => {
  const fields = 'id,media_type,media_url,thumbnail_url,caption,timestamp,like_count,comments_count';
  const url = `${BASE_URL}/${igUserId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
  const data = await fetcher(url);
  
  const parsedMedia = z.array(igMediaSchema).safeParse(data.data);
  if (!parsedMedia.success) {
    console.error("Failed to parse Instagram media:", parsedMedia.error);
    throw new Error("Received invalid media data from Instagram API.");
  }

  return { data: parsedMedia.data };
};
