import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Clock, Trash2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { fetchScans, deleteScan } from "@/lib/scans";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScanRow {
  id: string;
  created_at: string;
  risk_level: string;
  confidence: number;
  patterns: any;
  image_url: string;
  mole_label: string | null;
}

const riskColor: Record<string, string> = {
  Low: "text-risk-low bg-risk-low/10",
  Medium: "text-risk-medium bg-risk-medium/10",
  High: "text-risk-high bg-risk-high/10",
};

const HistoryPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<ScanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMole, setSelectedMole] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchScans().then((data) => {
      setRecords(data as ScanRow[]);
      setLoading(false);
    });
  }, [user]);

  const handleDelete = async (id: string) => {
    const ok = await deleteScan(id);
    if (ok) {
      setRecords((r) => r.filter((x) => x.id !== id));
      toast.success("Scan deleted.");
    }
  };

  // Unique mole labels for filter
  const moleLabels = useMemo(() => {
    const labels = new Set<string>();
    records.forEach((r) => {
      if (r.mole_label) labels.add(r.mole_label);
    });
    return Array.from(labels).sort();
  }, [records]);

  // Chart data for selected mole
  const chartData = useMemo(() => {
    const filtered = selectedMole === "all"
      ? records
      : records.filter((r) => r.mole_label === selectedMole);

    return filtered
      .slice()
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((r) => ({
        date: new Date(r.created_at).toLocaleDateString(),
        confidence: r.confidence,
        riskLevel: r.risk_level,
      }));
  }, [records, selectedMole]);

  if (!user) {
    return (
      <div className="min-h-screen gradient-hero">
        <Navbar />
        <main className="container py-8 max-w-3xl">
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed bg-card/50">
            <Clock className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm mb-3">Sign in to view your scan history</p>
            <a href="/auth">
              <Button variant="clinical" size="sm">Sign In</Button>
            </a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <main className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Scan History</h1>
          <p className="text-muted-foreground">
            Track your skin lesion analyses over time.
          </p>
        </div>

        {/* Mole Tracking Chart */}
        {records.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border bg-card p-6 shadow-card mb-6"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Mole Tracking — Risk Over Time
              </h3>
              {moleLabels.length > 0 && (
                <Select value={selectedMole} onValueChange={setSelectedMole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by mole" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All scans</SelectItem>
                    {moleLabels.map((label) => (
                      <SelectItem key={label} value={label}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {chartData.length >= 2 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Confidence %", angle: -90, position: "insideLeft", style: { fontSize: 12, fill: "hsl(var(--muted-foreground))" } }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      color: "hsl(var(--foreground))",
                    }}
                    formatter={(value: number, _name: string, props: any) => [
                      `${value}% (${props.payload.riskLevel})`,
                      "Confidence",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    name="Risk Confidence"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Need at least 2 scans to show trend. Keep scanning!
              </p>
            )}
          </motion.div>
        )}

        {/* Scan List */}
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        ) : records.length === 0 ? (
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
                  <img
                    src={r.image_url}
                    alt="Scan"
                    className="h-12 w-12 rounded-lg object-cover bg-muted"
                  />
                  <div className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${riskColor[r.risk_level] || ""}`}>
                    {r.risk_level}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(r.created_at).toLocaleDateString()}
                      {r.mole_label && (
                        <span className="ml-2 text-xs text-muted-foreground">· {r.mole_label}</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.confidence}% confidence
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(r.id)}
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
