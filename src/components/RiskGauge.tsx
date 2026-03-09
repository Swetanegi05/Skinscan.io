import { motion } from "framer-motion";
import { Shield, AlertTriangle, AlertOctagon } from "lucide-react";

interface RiskGaugeProps {
  level: "Low" | "Medium" | "High";
  confidence: number;
}

const config = {
  Low: { icon: Shield, colorClass: "text-risk-low", bgClass: "bg-risk-low/10", label: "Low Risk" },
  Medium: { icon: AlertTriangle, colorClass: "text-risk-medium", bgClass: "bg-risk-medium/10", label: "Medium Risk" },
  High: { icon: AlertOctagon, colorClass: "text-risk-high", bgClass: "bg-risk-high/10", label: "High Risk" },
};

const RiskGauge = ({ level, confidence }: RiskGaugeProps) => {
  const { icon: Icon, colorClass, bgClass, label } = config[level];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border bg-card p-6 shadow-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Risk Assessment</h3>
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className={`rounded-full p-3 ${bgClass}`}
        >
          <Icon className={`h-8 w-8 ${colorClass}`} />
        </motion.div>
        <div>
          <p className={`text-2xl font-bold ${colorClass}`}>{label}</p>
          <p className="text-sm text-muted-foreground">
            {confidence}% confidence
          </p>
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${confidence}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${
            level === "Low" ? "bg-risk-low" : level === "Medium" ? "bg-risk-medium" : "bg-risk-high"
          }`}
        />
      </div>
    </motion.div>
  );
};

export default RiskGauge;
