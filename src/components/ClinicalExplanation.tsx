import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, MapPin, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface ClinicalExplanationProps {
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  patterns: { name: string; probability: number }[];
}

const mockClinics = [
  { name: "Metro Dermatology Associates", address: "123 Medical Blvd, Suite 200", distance: "0.8 mi", phone: "(555) 234-5678" },
  { name: "University Skin Health Center", address: "456 University Ave", distance: "1.2 mi", phone: "(555) 345-6789" },
  { name: "Advanced Dermatologic Surgery", address: "789 Specialist Way", distance: "2.1 mi", phone: "(555) 456-7890" },
];

const ClinicalExplanation = ({ riskLevel, confidence, patterns }: ClinicalExplanationProps) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showClinics, setShowClinics] = useState(false);

  useEffect(() => {
    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("clinical-explanation", {
          body: { riskLevel, confidence, patterns },
        });

        if (fnError) throw fnError;
        setExplanation(data.explanation || data.error);
      } catch (err: any) {
        console.error("Failed to fetch explanation:", err);
        setError("Unable to generate clinical explanation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [riskLevel, confidence, patterns]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border bg-card p-6 shadow-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
        <Brain className="h-4 w-4" /> AI Clinical Explanation
      </h3>

      {loading ? (
        <div className="flex items-center gap-3 py-6 justify-center">
          <Loader2 className="h-5 w-5 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Generating clinical explanation...</p>
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : (
        <div className="prose prose-sm max-w-none text-foreground">
          <ReactMarkdown>{explanation || ""}</ReactMarkdown>
        </div>
      )}

      <div className="mt-4 rounded-lg bg-accent p-3 flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 text-accent-foreground mt-0.5 flex-shrink-0" />
        <p className="text-xs text-accent-foreground font-medium">
          This is not a diagnosis. Please consult a professional.
        </p>
      </div>

      {riskLevel === "High" && (
        <div className="mt-4">
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => setShowClinics(!showClinics)}
          >
            <MapPin className="h-4 w-4" />
            {showClinics ? "Hide Clinics" : "Find Nearby Dermatology Clinics"}
          </Button>

          {showClinics && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 space-y-2"
            >
              <div className="rounded-lg bg-muted p-3 mb-2">
                <p className="text-xs text-muted-foreground italic">
                  📍 Showing clinics near your area (mock data for demonstration)
                </p>
              </div>
              {mockClinics.map((clinic, i) => (
                <motion.div
                  key={clinic.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border bg-card p-3 flex items-start justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{clinic.name}</p>
                    <p className="text-xs text-muted-foreground">{clinic.address}</p>
                    <p className="text-xs text-muted-foreground">{clinic.phone}</p>
                  </div>
                  <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-1">
                    {clinic.distance}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default ClinicalExplanation;
