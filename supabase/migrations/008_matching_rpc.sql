-- Matching candidates RPC function
CREATE OR REPLACE FUNCTION get_matching_candidates(
  p_pet_id UUID,
  p_owner_id UUID,
  p_species TEXT DEFAULT NULL,
  p_latitude DOUBLE PRECISION DEFAULT NULL,
  p_longitude DOUBLE PRECISION DEFAULT NULL,
  p_max_distance_km INTEGER DEFAULT 50,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  owner_id UUID,
  name TEXT,
  species pet_species,
  breed TEXT,
  gender pet_gender,
  size pet_size,
  birth_date DATE,
  bio TEXT,
  personality TEXT[],
  avatar_url TEXT,
  photos TEXT[],
  owner_username TEXT,
  owner_avatar TEXT,
  distance_km DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.owner_id,
    p.name,
    p.species,
    p.breed,
    p.gender,
    p.size,
    p.birth_date,
    p.bio,
    p.personality,
    p.avatar_url,
    p.photos,
    pr.username AS owner_username,
    pr.avatar_url AS owner_avatar,
    CASE
      WHEN p_latitude IS NOT NULL AND pr.latitude IS NOT NULL
      THEN (
        6371 * acos(
          cos(radians(p_latitude)) * cos(radians(pr.latitude)) *
          cos(radians(pr.longitude) - radians(p_longitude)) +
          sin(radians(p_latitude)) * sin(radians(pr.latitude))
        )
      )
      ELSE NULL::DOUBLE PRECISION
    END AS distance_km
  FROM public.pets p
  JOIN public.profiles pr ON pr.id = p.owner_id
  WHERE p.is_active = true
    AND p.owner_id != p_owner_id
    AND p.id NOT IN (
      SELECT s.swiped_pet_id FROM public.swipes s
      WHERE s.swiper_pet_id = p_pet_id
    )
    AND (p_species IS NULL OR p.species::TEXT = p_species)
  ORDER BY
    CASE
      WHEN p_latitude IS NOT NULL AND pr.latitude IS NOT NULL
      THEN (
        6371 * acos(
          cos(radians(p_latitude)) * cos(radians(pr.latitude)) *
          cos(radians(pr.longitude) - radians(p_longitude)) +
          sin(radians(p_latitude)) * sin(radians(pr.latitude))
        )
      )
      ELSE 999999::DOUBLE PRECISION
    END ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
