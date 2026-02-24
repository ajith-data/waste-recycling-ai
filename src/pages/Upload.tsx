import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Loader2, Recycle, Trash2, Leaf, Zap, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const binColors: Record<string, string> = {
  Plastic: "bg-blue-500",
  Paper: "bg-amber-500",
  Glass: "bg-cyan-500",
  Metal: "bg-gray-500",
  Organic: "bg-green-600",
  "E-Waste": "bg-purple-500",
  Hazardous: "bg-red-500",
};

interface PredictionResult {
  predicted_class: string;
  confidence_score: number;
  recycling_bin: string;
  environmental_impact: string;
  sustainability_tips: string[];
  explanation: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: "File too large (max 10MB)", variant: "destructive" });
      return;
    }
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f);
      setResult(null);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!file || !preview) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload image
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("waste-images").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("waste-images").getPublicUrl(path);

      // Call AI edge function
      const { data, error } = await supabase.functions.invoke("classify-waste", {
        body: { imageBase64: preview, imageUrl: publicUrl },
      });
      if (error) throw error;

      const prediction: PredictionResult = data;
      setResult(prediction);

      // Save to history
      await supabase.from("predictions").insert({
        user_id: user.id,
        image_url: publicUrl,
        predicted_class: prediction.predicted_class,
        confidence_score: prediction.confidence_score,
        recycling_info: {
          recycling_bin: prediction.recycling_bin,
          environmental_impact: prediction.environmental_impact,
          sustainability_tips: prediction.sustainability_tips,
        },
        chat_response: prediction.explanation,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Analyze Waste</h1>
          <p className="text-muted-foreground">Upload an image and our AI will classify it instantly</p>
        </div>

        {!preview ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-primary/30 rounded-2xl p-12 text-center hover:border-primary/60 transition-colors cursor-pointer bg-accent/30"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input id="file-input" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="eco-gradient w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UploadIcon className="h-8 w-8 text-primary-foreground" />
            </div>
            <p className="font-display font-semibold text-lg mb-1">Drop your image here</p>
            <p className="text-muted-foreground text-sm">or click to browse • JPG, PNG, WebP up to 10MB</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Image + Result Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <span className="font-medium text-sm">Uploaded Image</span>
                  <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-muted-foreground">
                    <Trash2 className="h-3.5 w-3.5" /> Clear
                  </Button>
                </div>
                <div className="p-4">
                  <img src={preview} alt="Waste preview" className="w-full rounded-xl object-contain max-h-80" />
                </div>
                {!result && (
                  <div className="p-4 pt-0">
                    <Button onClick={handleAnalyze} disabled={loading} className="w-full eco-gradient text-primary-foreground gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                      {loading ? "Analyzing..." : "Analyze Image"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Result Card */}
              {result ? (
                <div className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up">
                  <div className="p-4 border-b border-border">
                    <span className="font-medium text-sm">Classification Result</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded-full ${binColors[result.predicted_class] || "bg-primary"}`} />
                      <span className="font-display font-bold text-2xl">{result.predicted_class}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-accent rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Confidence</p>
                        <p className="font-display font-bold text-lg text-primary">{result.confidence_score}%</p>
                      </div>
                      <div className="bg-accent rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">Recycling Bin</p>
                        <p className="font-display font-bold text-lg">{result.recycling_bin}</p>
                      </div>
                    </div>

                    <div className="bg-accent rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Environmental Impact</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.environmental_impact}</p>
                    </div>

                    <div className="bg-accent rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Recycle className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Sustainability Tips</span>
                      </div>
                      <ul className="space-y-1.5">
                        {result.sustainability_tips.map((tip, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary">•</span> {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : loading ? (
                <div className="bg-card rounded-2xl border border-border flex items-center justify-center p-12">
                  <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-3" />
                    <p className="font-medium">Analyzing your image...</p>
                    <p className="text-sm text-muted-foreground">Our AI is classifying the waste type</p>
                  </div>
                </div>
              ) : null}
            </div>

            {/* AI Explanation */}
            {result && (
              <div className="bg-card rounded-2xl border border-border p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="font-display font-semibold text-lg">AI Explanation</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{result.explanation}</p>
                <div className="mt-4">
                  <Button variant="outline" onClick={reset} className="gap-2">
                    <UploadIcon className="h-4 w-4" /> Analyze Another Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
