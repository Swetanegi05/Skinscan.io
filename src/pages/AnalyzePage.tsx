import { useState } from "react";
import Navbar from "@/components/Navbar";
import ImageUploader from "@/components/ImageUploader";
import RiskGauge from "@/components/RiskGauge";
import DetectedPatterns from "@/components/DetectedPatterns";
import NextSteps from "@/components/NextSteps";
import ClinicalExplanation from "@/components/ClinicalExplanation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { saveScan } from "@/lib/scans";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AnalysisResult {
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  patterns: { name: string; probability: number }[];
  steps: string[];
}

const ROBOFLOW_API_KEY = "mKIKYFZVQR6tUWjtzli0";
const ROBOFLOW_MODEL = "skin-cancer-vczfq/1";

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const mapRoboflowToResult = (data: any): AnalysisResult => {
  const predictions = data.predictions || [];
  let topConfidence = 0;
  const patterns: { name: string; probability: number }[] = [];

  if (Array.isArray(predictions)) {
    for (const pred of predictions) {
      const conf = Math.round((pred.confidence || 0) * 100);
      topConfidence = Math.max(topConfidence, conf);
      patterns.push({ name: pred.class || "Unknown", probability: conf });
    }
  } else if (typeof predictions === "object") {
    for (const [className, conf] of Object.entries(predictions)) {
      const pct = Math.round((conf as number) * 100);
      topConfidence = Math.max(topConfidence, pct);
      patterns.push({ name: className, probability: pct });
    }
  }

  if (data.top && data.confidence != null) {
    topConfidence = Math.round(data.confidence * 100);
    if (patterns.length === 0) {
      patterns.push({ name: data.top, probability: topConfidence });
    }
  }

  if (patterns.length === 0) {
    patterns.push({ name: "No patterns detected", probability: 0 });
  }

  patterns.sort((a, b) => b.probability - a.probability);

  let riskLevel: "Low" | "Medium" | "High";
  if (topConfidence > 80) riskLevel = "High";
  else if (topConfidence > 50) riskLevel = "Medium";
  else riskLevel = "Low";

  const stepSets = {
    Low: [
      "Document this lesion with photos for future comparison",
      "Monitor for any changes in size, shape, or color",
      "Perform routine self-examinations monthly",
      "Schedule annual dermatology screening",
    ],
    Medium: [
      "Schedule a dermatologist appointment within 2 weeks",
      "Avoid sun exposure on the affected area",
      "Document changes with weekly photographs",
      "Consider dermoscopic follow-up evaluation",
    ],
    High: [
      "Seek immediate consultation with a dermatologist",
      "Request dermoscopic examination and possible biopsy",
      "Avoid manipulating or irritating the lesion",
      "Prepare medical history for specialist visit",
      "Consider referral to dermatologic oncology",
    ],
  };

  return { riskLevel, confidence: topConfidence, patterns, steps: stepSets[riskLevel] };
};

const AnalyzePage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [moleLabel, setMoleLabel] = useState("");
  const { user } = useAuth();

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    setCurrentFile(file);
    try {
      const base64 = await fileToBase64(file);
      const response = await fetch(
        `https://detect.roboflow.com/${ROBOFLOW_MODEL}?api_key=${ROBOFLOW_API_KEY}`,
        {
          method: "POST",
          body: base64,
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      console.log("Roboflow response:", data);
      const mapped = mapRoboflowToResult(data);
      setResult(mapped);

      // Auto-save if logged in
      if (user) {
        const saved = await saveScan({
          file,
          riskLevel: mapped.riskLevel,
          confidence: mapped.confidence,
          patterns: mapped.patterns,
          steps: mapped.steps,
          moleLabel: moleLabel || undefined,
        });
        if (saved) toast.success("Scan saved to your history.");
      }
    } catch (err) {
      console.error("Analysis failed:", err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <main className="container py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Skin Lesion Analysis</h1>
          <p className="text-muted-foreground">
            Upload a dermatoscopic or clinical image for AI-powered pattern analysis.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-4">
            {user && (
              <div>
                <Label htmlFor="mole-label" className="text-sm font-medium text-foreground">
                  Mole Label (for tracking)
                </Label>
                <Input
                  id="mole-label"
                  placeholder="e.g. Left arm, Back mole #2"
                  value={moleLabel}
                  onChange={(e) => setMoleLabel(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            <ImageUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            {!user && (
              <p className="text-xs text-muted-foreground text-center">
                <a href="/auth" className="text-primary hover:underline">Sign in</a> to save scans to your history.
              </p>
            )}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <RiskGauge level={result.riskLevel} confidence={result.confidence} />
                  <DetectedPatterns patterns={result.patterns} />
                  <NextSteps steps={result.steps} riskLevel={result.riskLevel} />
                  <ClinicalExplanation
                    riskLevel={result.riskLevel}
                    confidence={result.confidence}
                    patterns={result.patterns}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-64 rounded-xl border-2 border-dashed bg-card/50"
                >
                  <p className="text-muted-foreground text-sm">
                    Upload an image to see analysis results
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyzePage;
