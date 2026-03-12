CREATE TYPE swipe_direction AS ENUM ('left', 'right', 'super');
CREATE TYPE match_status AS ENUM ('pending', 'matched', 'unmatched', 'blocked');

CREATE TABLE public.swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  swiped_pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  direction swipe_direction NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(swiper_pet_id, swiped_pet_id),
  CHECK(swiper_pet_id != swiped_pet_id)
);

CREATE INDEX idx_swipes_swiper ON public.swipes(swiper_pet_id);
CREATE INDEX idx_swipes_swiped ON public.swipes(swiped_pet_id);

CREATE TABLE public.matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet1_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  pet2_id UUID REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
  status match_status DEFAULT 'matched',
  matched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pet1_id, pet2_id),
  CHECK(pet1_id < pet2_id)
);

CREATE INDEX idx_matches_pet1 ON public.matches(pet1_id);
CREATE INDEX idx_matches_pet2 ON public.matches(pet2_id);

-- Auto-create match on mutual right swipe
CREATE OR REPLACE FUNCTION check_and_create_match()
RETURNS TRIGGER AS $$
DECLARE
  mutual_swipe RECORD;
  p1 UUID;
  p2 UUID;
BEGIN
  IF NEW.direction IN ('right', 'super') THEN
    SELECT * INTO mutual_swipe FROM public.swipes
    WHERE swiper_pet_id = NEW.swiped_pet_id
      AND swiped_pet_id = NEW.swiper_pet_id
      AND direction IN ('right', 'super');

    IF FOUND THEN
      IF NEW.swiper_pet_id < NEW.swiped_pet_id THEN
        p1 := NEW.swiper_pet_id;
        p2 := NEW.swiped_pet_id;
      ELSE
        p1 := NEW.swiped_pet_id;
        p2 := NEW.swiper_pet_id;
      END IF;

      INSERT INTO public.matches (pet1_id, pet2_id, status)
      VALUES (p1, p2, 'matched')
      ON CONFLICT (pet1_id, pet2_id) DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_swipe_check_match
  AFTER INSERT ON public.swipes
  FOR EACH ROW EXECUTE FUNCTION check_and_create_match();

ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swipes" ON public.swipes FOR SELECT
  USING (swiper_pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid()));
CREATE POLICY "Users can create swipes for own pets" ON public.swipes FOR INSERT
  WITH CHECK (swiper_pet_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid()));

CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT
  USING (
    pet1_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid())
    OR pet2_id IN (SELECT id FROM public.pets WHERE owner_id = auth.uid())
  );
