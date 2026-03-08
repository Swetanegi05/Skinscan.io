-- Create storage bucket for scan images
INSERT INTO storage.buckets (id, name, public) VALUES ('scan-images', 'scan-images', true);

-- Storage policies
CREATE POLICY "Users can upload their own scan images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scan-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Scan images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'scan-images');

CREATE POLICY "Users can delete their own scan images"
ON storage.objects FOR DELETE
USING (bucket_id = 'scan-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create scans table
CREATE TABLE public.scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  confidence INTEGER NOT NULL,
  patterns JSONB NOT NULL DEFAULT '[]',
  steps JSONB NOT NULL DEFAULT '[]',
  mole_label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own scans"
ON public.scans FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scans"
ON public.scans FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
ON public.scans FOR DELETE
USING (auth.uid() = user_id);

-- Index for fast history queries
CREATE INDEX idx_scans_user_date ON public.scans (user_id, created_at DESC);