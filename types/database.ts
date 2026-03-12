export type PetSpecies = "dog" | "cat" | "bird" | "rabbit" | "hamster" | "other";
export type PetGender = "male" | "female" | "unknown";
export type PetSize = "tiny" | "small" | "medium" | "large" | "giant";
export type SwipeDirection = "left" | "right" | "super";
export type MatchStatus = "pending" | "matched" | "unmatched" | "blocked";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  latitude: number | null;
  longitude: number | null;
  push_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  species: PetSpecies;
  breed: string | null;
  gender: PetGender;
  size: PetSize;
  birth_date: string | null;
  bio: string | null;
  personality: string[];
  avatar_url: string | null;
  photos: string[];
  is_neutered: boolean;
  is_vaccinated: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  owner?: Profile;
}

export interface Video {
  id: string;
  user_id: string;
  pet_id: string | null;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  hashtags: string[];
  duration: number | null;
  width: number | null;
  height: number | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  share_count: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  user?: Pick<Profile, "id" | "username" | "avatar_url">;
  pet?: Pick<Pet, "id" | "name" | "breed" | "avatar_url"> | null;
  is_liked?: boolean;
}

export interface Like {
  id: string;
  user_id: string;
  video_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  video_id: string;
  parent_id: string | null;
  content: string;
  like_count: number;
  created_at: string;
  // Joined
  user?: Pick<Profile, "id" | "username" | "avatar_url">;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface Swipe {
  id: string;
  swiper_pet_id: string;
  swiped_pet_id: string;
  direction: SwipeDirection;
  created_at: string;
}

export interface Match {
  id: string;
  pet1_id: string;
  pet2_id: string;
  status: MatchStatus;
  matched_at: string;
  // Joined
  pet1?: Pet;
  pet2?: Pet;
}

export interface Conversation {
  id: string;
  match_id: string;
  last_message_content: string | null;
  last_message_at: string | null;
  created_at: string;
  // Joined
  match?: Match;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
  // Joined
  sender?: Pick<Profile, "id" | "username" | "avatar_url">;
}

// Supabase Database type mapping
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      pets: {
        Row: Pet;
        Insert: Omit<Pet, "id" | "created_at" | "updated_at" | "owner">;
        Update: Partial<Omit<Pet, "id" | "owner_id" | "created_at" | "owner">>;
      };
      videos: {
        Row: Video;
        Insert: Omit<Video, "id" | "view_count" | "like_count" | "comment_count" | "share_count" | "created_at" | "updated_at" | "user" | "pet" | "is_liked">;
        Update: Partial<Omit<Video, "id" | "user_id" | "created_at" | "user" | "pet" | "is_liked">>;
      };
      likes: {
        Row: Like;
        Insert: Omit<Like, "id" | "created_at">;
        Update: never;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, "id" | "like_count" | "created_at" | "user">;
        Update: never;
      };
      follows: {
        Row: Follow;
        Insert: Omit<Follow, "id" | "created_at">;
        Update: never;
      };
      swipes: {
        Row: Swipe;
        Insert: Omit<Swipe, "id" | "created_at">;
        Update: never;
      };
      matches: {
        Row: Match;
        Insert: never;
        Update: Partial<Pick<Match, "status">>;
      };
      conversations: {
        Row: Conversation;
        Insert: never;
        Update: never;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "is_read" | "created_at" | "sender">;
        Update: Partial<Pick<Message, "is_read">>;
      };
    };
  };
};
