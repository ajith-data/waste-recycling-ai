import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload as UploadIcon, Loader2, Recycle, Trash2, Leaf, Zap, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Chatbot from "@/components/Chatbot";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast({ title: t("upload.imageError"), variant: "destructive" });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: t("upload.sizeError"), variant: "destructive" });
      return;
    }
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  }, [toast, t]);

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

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      toast({ title: t("upload.cameraError"), variant: "destructive" });
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    // Convert to file
    canvas.toBlob((blob) => {
      if (blob) setFile(new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" }));
    }, "image/jpeg", 0.9);
    stopCamera();
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file || !preview) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("waste-images").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("waste-images").getPublicUrl(path);

      const { data, error } = await supabase.functions.invoke("classify-waste", {
        body: { imageBase64: preview, imageUrl: publicUrl },
      });
      if (error) throw error;

      const prediction: PredictionResult = data;
      setResult(prediction);

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
      toast({ title: t("upload.analysisFailed"), description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">{t("upload.title")}</h1>
          <p className="text-muted-foreground">{t("upload.subtitle")}</p>
        </div>

        {/* Camera view */}
        {cameraActive && (
          <div className="relative rounded-2xl overflow-hidden border-2 border-primary/30 mb-6 bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-96 object-contain" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
              <Button onClick={capturePhoto} size="lg" className="eco-gradient text-primary-foreground gap-2 rounded-full px-8">
                <Camera className="h-5 w-5" />
                {t("upload.capture")}
              </Button>
              <Button onClick={stopCamera} size="lg" variant="outline" className="rounded-full bg-background/80">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {!preview && !cameraActive ? (
          <div className="space-y-4">
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
              <p className="font-display font-semibold text-lg mb-1">{t("upload.drop")}</p>
              <p className="text-muted-foreground text-sm">JPG, PNG, WebP — max 10MB</p>
            </div>
            <div className="text-center">
              <Button onClick={startCamera} variant="outline" size="lg" className="gap-2">
                <Camera className="h-5 w-5" />
                {t("upload.useCamera")}
              </Button>
            </div>
          </div>
        ) : preview ? (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex justify-between items-center">
                  <span className="font-medium text-sm">{t("upload.uploadedImage")}</span>
                  <Button variant="ghost" size="sm" onClick={reset} className="gap-1 text-muted-foreground">
                    <Trash2 className="h-3.5 w-3.5" /> {t("upload.clear")}
                  </Button>
                </div>
                <div className="p-4">
                  <img src={preview} alt="Waste preview" className="w-full rounded-xl object-contain max-h-80" />
                </div>
                {!result && (
                  <div className="p-4 pt-0">
                    <Button onClick={handleAnalyze} disabled={loading} className="w-full eco-gradient text-primary-foreground gap-2">
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                      {loading ? t("upload.analyzing") : t("upload.analyze")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Result Card */}
              {result ? (
                <div className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up">
                  <div className="p-4 border-b border-border">
                    <span className="font-medium text-sm">{t("upload.result")}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded-full ${binColors[result.predicted_class] || "bg-primary"}`} />
                      <span className="font-display font-bold text-2xl">{result.predicted_class}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-accent rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">{t("upload.confidence")}</p>
                        <p className="font-display font-bold text-lg text-primary">{result.confidence_score}%</p>
                      </div>
                      <div className="bg-accent rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-1">{t("upload.recyclingBin")}</p>
                        <p className="font-display font-bold text-lg">{result.recycling_bin}</p>
                      </div>
                    </div>
                    <div className="bg-accent rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{t("upload.envImpact")}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{result.environmental_impact}</p>
                    </div>
                    <div className="bg-accent rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Recycle className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">{t("upload.sustainTips")}</span>
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
                    <p className="font-medium">{t("upload.analyzing")}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {result && <Chatbot initialContext={result.explanation} />}

            {result && (
              <div className="text-center">
                <Button variant="outline" onClick={reset} className="gap-2">
                  <UploadIcon className="h-4 w-4" /> {t("upload.analyzeAnother")}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
