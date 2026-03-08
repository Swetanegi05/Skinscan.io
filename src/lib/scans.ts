import { supabase } from "@/integrations/supabase/client";

interface ScanData {
  file: File;
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  patterns: { name: string; probability: number }[];
  steps: string[];
  moleLabel?: string;
}

export const saveScan = async (data: ScanData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Upload image
  const ext = data.file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("scan-images")
    .upload(path, data.file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("scan-images")
    .getPublicUrl(path);

  const { data: scan, error } = await supabase.from("scans").insert({
    user_id: user.id,
    image_url: urlData.publicUrl,
    risk_level: data.riskLevel,
    confidence: data.confidence,
    patterns: data.patterns as any,
    steps: data.steps as any,
    mole_label: data.moleLabel || null,
  }).select().single();

  if (error) {
    console.error("Insert error:", error);
    return null;
  }

  return scan;
};

export const fetchScans = async () => {
  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }
  return data;
};

export const deleteScan = async (id: string) => {
  const { error } = await supabase.from("scans").delete().eq("id", id);
  if (error) console.error("Delete error:", error);
  return !error;
};
