CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  pet_id UUID REFERENCES public.pets(id) ON DELETE SET NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  hashtags TEXT[],
  duration INTEGER,
  width INTEGER,
  height INTEGER,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_videos_user ON public.videos(user_id);
CREATE INDEX idx_videos_pet ON public.videos(pet_id);
CREATE INDEX idx_videos_created ON public.videos(created_at DESC);
CREATE INDEX idx_videos_hashtags ON public.videos USING GIN(hashtags);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published videos are viewable by everyone"
  ON public.videos FOR SELECT USING (is_published = true OR auth.uid() = user_id);
CREATE POLICY "Users can insert own videos"
  ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own videos"
  ON public.videos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own videos"
  ON public.videos FOR DELETE USING (auth.uid() = user_id);
