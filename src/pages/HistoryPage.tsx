import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ScanRecord {
  id: string;
  date: string;
  riskLevel: "Low" | "Medium" | "High";
  confidence: number;
  patternsCount: number;
}

const mockHistory: ScanRecord[] = [
  { id: "1", date: "2026-03-08", riskLevel: "Low", confidence: 91, patternsCount: 4 },
  { id: "2", date: "2026-03-07", riskLevel: "Medium", confidence: 78, patternsCount: 4 },
  { id: "3", date: "2026-03-05", riskLevel: "High", confidence: 85, patternsCount: 5 },
  { id: "4", date: "2026-03-01", riskLevel: "Low", confidence: 88, patternsCount: 3 },
];

const riskColor = {
  Low: "text-risk-low bg-risk-low/10",
  Medium: "text-risk-medium bg-risk-medium/10",
  High: "text-risk-high bg-risk-high/10",
};

const HistoryPage = () => {
  const [records, setRecords] = useState(mockHistory);

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scan History</h1>
          <p className="text-muted-foreground">
            Review your previous skin lesion analyses.
          </p>
        </div>

        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed bg-card/50">
            <Clock className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No scan history yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-card"
              >
                <div className="flex items-center gap-4">
                  <div className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${riskColor[r.riskLevel]}`}>
                    {r.riskLevel}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.date}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.patternsCount} patterns · {r.confidence}% confidence
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => setRecords(records.filter((x) => x.id !== r.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
