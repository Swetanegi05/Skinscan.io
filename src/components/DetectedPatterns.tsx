import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface DetectedPatternsProps {
  patterns: { name: string; probability: number }[];
}

const DetectedPatterns = ({ patterns }: DetectedPatternsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-xl border bg-card p-6 shadow-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
        <Eye className="h-4 w-4" /> Detected Patterns
      </h3>
      <div className="space-y-3">
        {patterns.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="flex items-center justify-between"
          >
            <span className="text-sm font-medium text-foreground">{p.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${p.probability}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                  className="h-full rounded-full gradient-clinical"
                />
              </div>
              <span className="text-xs text-muted-foreground font-mono w-10 text-right">
                {p.probability}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DetectedPatterns;
