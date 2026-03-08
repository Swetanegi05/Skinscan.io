import { useState } from "react";
import Navbar from "@/components/Navbar";
import ImageUploader from "@/components/ImageUploader";
import RiskGauge from "@/components/RiskGauge";
import DetectedPatterns from "@/components/DetectedPatterns";
import NextSteps from "@/components/NextSteps";
import { AnimatePresence, motion } from "framer-motion";

interface AnalysisResult {
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  patterns: { name: string; probability: number }[];
  steps: string[];
}

const mockAnalyze = (): Promise<AnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const levels: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];
      const level = levels[Math.floor(Math.random() * 3)];

      const patternSets = {
        Low: [
          { name: "Symmetric border", probability: 88 },
          { name: "Uniform pigmentation", probability: 92 },
          { name: "Regular dermoscopic pattern", probability: 85 },
          { name: "No vascular structures", probability: 78 },
        ],
        Medium: [
          { name: "Irregular border segments", probability: 67 },
          { name: "Two-tone pigmentation", probability: 72 },
          { name: "Atypical globules", probability: 58 },
          { name: "Regression structures", probability: 45 },
        ],
        High: [
          { name: "Asymmetric morphology", probability: 89 },
          { name: "Irregular pigment network", probability: 84 },
          { name: "Blue-white veil", probability: 76 },
          { name: "Atypical vascular pattern", probability: 71 },
          { name: "Ulceration detected", probability: 62 },
        ],
      };

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

      resolve({
        riskLevel: level,
        confidence: 70 + Math.floor(Math.random() * 25),
        patterns: patternSets[level],
        steps: stepSets[level],
      });
    }, 2500);
  });
};

const AnalyzePage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (_file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await mockAnalyze();
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <main className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Skin Lesion Analysis</h1>
          <p className="text-muted-foreground">
            Upload a dermatoscopic or clinical image for AI-powered pattern analysis.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ImageUploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
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
