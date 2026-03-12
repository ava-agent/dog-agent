-- Storage buckets (run via Supabase Dashboard or API)
-- avatars: public, 5MB limit, images only
-- pet-photos: public, 10MB limit, images only
-- videos: public, 100MB limit, video only
-- thumbnails: public, 5MB limit, images only
-- chat-media: private, 20MB limit, images+video

-- Note: Storage bucket creation and policies are typically
-- configured via the Supabase Dashboard. These SQL statements
-- serve as documentation of the intended configuration.

-- If using Supabase CLI, buckets can be created with:
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES
--   ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
--   ('pet-photos', 'pet-photos', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
--   ('videos', 'videos', true, 104857600, ARRAY['video/mp4', 'video/quicktime', 'video/webm']),
--   ('thumbnails', 'thumbnails', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
--   ('chat-media', 'chat-media', false, 20971520, ARRAY['image/jpeg', 'image/png', 'video/mp4']);
