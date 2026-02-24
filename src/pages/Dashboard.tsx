import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, BarChart3, Recycle, Clock, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prediction {
  id: string;
  image_url: string;
  predicted_class: string;
  confidence_score: number;
  chat_response: string;
  created_at: string;
}

const binColors: Record<string, string> = {
  Plastic: "bg-blue-500",
  Paper: "bg-amber-500",
  Glass: "bg-cyan-500",
  Metal: "bg-gray-500",
  Organic: "bg-green-600",
  "E-Waste": "bg-purple-500",
  Hazardous: "bg-red-500",
};

export default function Dashboard() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading history", variant: "destructive" });
    } else {
      setPredictions((data as Prediction[]) || []);
    }
    setLoading(false);
  };

  const deletePrediction = async (id: string) => {
    await supabase.from("predictions").delete().eq("id", id);
    setPredictions((prev) => prev.filter((p) => p.id !== id));
  };

  const totalUploads = predictions.length;
  const avgConfidence = totalUploads > 0
    ? (predictions.reduce((a, p) => a + Number(p.confidence_score), 0) / totalUploads).toFixed(1)
    : "0";
  const mostCommon = totalUploads > 0
    ? Object.entries(
        predictions.reduce<Record<string, number>>((acc, p) => {
          acc[p.predicted_class] = (acc[p.predicted_class] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    : "N/A";

  const stats = [
    { label: "Total Uploads", value: totalUploads, icon: Upload },
    { label: "Most Common", value: mostCommon, icon: Recycle },
    { label: "Avg Confidence", value: `${avgConfidence}%`, icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Your recycling activity overview</p>
          </div>
          <Link to="/upload">
            <Button className="eco-gradient text-primary-foreground gap-2">
              <Upload className="h-4 w-4" /> New Upload
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card rounded-xl border border-border p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-2">
                <div className="eco-gradient w-10 h-10 rounded-lg flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <p className="font-display font-bold text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="font-display font-semibold text-lg">Prediction History</h2>
          </div>
          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Loading...</div>
          ) : predictions.length === 0 ? (
            <div className="p-12 text-center">
              <Recycle className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">No predictions yet. Upload your first image!</p>
              <Link to="/upload">
                <Button className="mt-4 eco-gradient text-primary-foreground gap-2">
                  <Upload className="h-4 w-4" /> Upload Image
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {predictions.map((p) => (
                <div key={p.id} className="p-4 flex items-center gap-4 hover:bg-accent/30 transition-colors">
                  <img src={p.image_url} alt={p.predicted_class} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full flex-shrink-0 ${binColors[p.predicted_class] || "bg-primary"}`} />
                      <span className="font-medium">{p.predicted_class}</span>
                      <span className="text-sm text-primary font-medium">{Number(p.confidence_score).toFixed(1)}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{p.chat_response}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => deletePrediction(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
