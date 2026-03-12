CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE UNIQUE NOT NULL,
  last_message_content TEXT,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_last_msg ON public.conversations(last_message_at DESC);

CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  media_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);

CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_content = NEW.content, last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Auto-create conversation when match is created
CREATE OR REPLACE FUNCTION create_conversation_for_match()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.conversations (match_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_match_created
  AFTER INSERT ON public.matches
  FOR EACH ROW EXECUTE FUNCTION create_conversation_for_match();

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON public.conversations FOR SELECT
  USING (match_id IN (
    SELECT m.id FROM public.matches m
    JOIN public.pets p ON (p.id = m.pet1_id OR p.id = m.pet2_id)
    WHERE p.owner_id = auth.uid()
  ));

CREATE POLICY "Users can view messages in own conversations" ON public.messages FOR SELECT
  USING (conversation_id IN (
    SELECT c.id FROM public.conversations c
    JOIN public.matches m ON m.id = c.match_id
    JOIN public.pets p ON (p.id = m.pet1_id OR p.id = m.pet2_id)
    WHERE p.owner_id = auth.uid()
  ));

CREATE POLICY "Users can send messages in own conversations" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id AND conversation_id IN (
    SELECT c.id FROM public.conversations c
    JOIN public.matches m ON m.id = c.match_id
    JOIN public.pets p ON (p.id = m.pet1_id OR p.id = m.pet2_id)
    WHERE p.owner_id = auth.uid()
  ));
