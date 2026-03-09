import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Microscope, Brain } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const features = [
    {
      icon: Microscope,
      title: "Dermoscopic Analysis",
      description: "Upload clinical or dermoscopic images for AI pattern recognition.",
    },
    {
      icon: Brain,
      title: "Pattern Detection",
      description: "Identifies asymmetry, border irregularity, color variation, and structures.",
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Receive a risk classification with confidence scoring and next steps.",
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="container py-24 lg:py-32 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-accent-foreground">AI-Powered Dermatology</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Clinical-Grade Skin
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(187,72%,38%)] to-[hsl(200,80%,45%)]">Lesion Analysis</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              SkinScan.io combines deep learning with dermoscopic pattern analysis to provide
              rapid risk assessments and actionable clinical recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/analyze">
                <Button variant="clinical" size="lg" className="gap-2">
                  Start Analysis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" size="lg">
                  View History
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="container pb-24 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="rounded-xl border bg-card p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="rounded-lg bg-accent p-3 w-fit mb-4">
                  <f.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
