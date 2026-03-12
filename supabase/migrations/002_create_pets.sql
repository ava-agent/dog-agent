CREATE TYPE pet_species AS ENUM ('dog', 'cat', 'bird', 'rabbit', 'hamster', 'other');
CREATE TYPE pet_gender AS ENUM ('male', 'female', 'unknown');
CREATE TYPE pet_size AS ENUM ('tiny', 'small', 'medium', 'large', 'giant');

CREATE TABLE public.pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  species pet_species NOT NULL DEFAULT 'dog',
  breed TEXT,
  gender pet_gender DEFAULT 'unknown',
  size pet_size DEFAULT 'medium',
  birth_date DATE,
  bio TEXT,
  personality TEXT[],
  avatar_url TEXT,
  photos TEXT[],
  is_neutered BOOLEAN DEFAULT false,
  is_vaccinated BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pets_owner ON public.pets(owner_id);
CREATE INDEX idx_pets_species ON public.pets(species);

ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pets are viewable by everyone" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Users can insert own pets" ON public.pets FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own pets" ON public.pets FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own pets" ON public.pets FOR DELETE USING (auth.uid() = owner_id);
