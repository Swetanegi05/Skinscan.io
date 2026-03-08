import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

interface NextStepsProps {
  steps: string[];
  riskLevel: "Low" | "Medium" | "High";
}

const NextSteps = ({ steps, riskLevel }: NextStepsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-xl border bg-card p-6 shadow-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
        <ClipboardList className="h-4 w-4" /> Recommended Next Steps
      </h3>
      <div className={`rounded-lg p-4 mb-4 ${
        riskLevel === "High" ? "bg-risk-high/10" : riskLevel === "Medium" ? "bg-risk-medium/10" : "bg-accent"
      }`}>
        <p className="text-sm font-medium text-foreground">
          {riskLevel === "High"
            ? "⚠️ Urgent: Consult a dermatologist immediately."
            : riskLevel === "Medium"
            ? "Schedule a dermatologist visit within 2 weeks."
            : "Continue regular skin monitoring."}
        </p>
      </div>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 + i * 0.05 }}
            className="flex gap-3 text-sm"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-medium">
              {i + 1}
            </span>
            <span className="text-foreground">{step}</span>
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-muted-foreground italic">
        Disclaimer: This is not a medical diagnosis. Always consult a qualified healthcare provider.
      </p>
    </motion.div>
  );
};

export default NextSteps;
