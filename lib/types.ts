export type PostRow = {
  id: string;
  user_id: string | null;
  body: string | null;
  created_at: string;
  photo_url: string | null;
};

export type WallPost = {
  id: string;
  author: string;
  body: string | null;
  created_at: string;
  photo_url: string | null;
  isStatic?: boolean;
};

export type StaticPostSeed = {
  id: string;
  author: string;
  body: string;
  hoursAgo: number;
};

export type ShareInput = {
  body: string;
  photo: File | null;
};
