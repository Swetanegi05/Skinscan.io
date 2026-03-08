import { useCallback, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ImageUploaderProps {
  onAnalyze: (file: File) => void;
  isAnalyzing: boolean;
}

const ImageUploader = ({ onAnalyze, isAnalyzing }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const clear = () => {
    setPreview(null);
    setFile(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${
              dragOver
                ? "border-primary bg-accent"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            }`}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = (e) => {
                const f = (e.target as HTMLInputElement).files?.[0];
                if (f) handleFile(f);
              };
              input.click();
            }}
          >
            <div className="rounded-full bg-accent p-4 mb-4">
              <Upload className="h-8 w-8 text-accent-foreground" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">
              Drop a skin lesion image here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse · JPG, PNG up to 10MB
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-xl overflow-hidden border bg-card shadow-card"
          >
            <div className="relative aspect-video flex items-center justify-center bg-muted">
              <img
                src={preview}
                alt="Uploaded skin lesion"
                className="max-h-full max-w-full object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full gradient-clinical animate-pulse-ring absolute inset-0" />
                      <Loader2 className="h-12 w-12 text-primary animate-spin" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Analyzing lesion...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-4">
              <p className="text-sm text-muted-foreground truncate">{file?.name}</p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={clear} disabled={isAnalyzing}>
                  <X className="h-4 w-4 mr-1" /> Remove
                </Button>
                <Button
                  variant="clinical"
                  size="sm"
                  onClick={() => file && onAnalyze(file)}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Run Analysis"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
