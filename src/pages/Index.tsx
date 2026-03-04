import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Leaf, Brain, BarChart3, Globe, Upload } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const wasteTypeKeys = [
  { key: "waste.plastic", color: "bg-blue-500" },
  { key: "waste.paper", color: "bg-amber-500" },
  { key: "waste.glass", color: "bg-cyan-500" },
  { key: "waste.metal", color: "bg-gray-500" },
  { key: "waste.organic", color: "bg-green-600" },
  { key: "waste.ewaste", color: "bg-purple-500" },
  { key: "waste.hazardous", color: "bg-red-500" },
];

const featureKeys = [
  { icon: Brain, titleKey: "feature.aiClassification", descKey: "feature.aiClassificationDesc" },
  { icon: Recycle, titleKey: "feature.recyclingGuidance", descKey: "feature.recyclingGuidanceDesc" },
  { icon: BarChart3, titleKey: "feature.trackImpact", descKey: "feature.trackImpactDesc" },
  { icon: Globe, titleKey: "feature.multilingual", descKey: "feature.multilingualDesc" },
];

export default function Index() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <Leaf className="h-4 w-4" />
              {t("home.badge")}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
              {t("home.title")}{" "}
              <span className="text-gradient">RecycAI</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("home.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Link to="/register">
                <Button size="lg" className="eco-gradient text-primary-foreground gap-2 text-base px-8 animate-pulse-glow">
                  <Upload className="h-5 w-5" />
                  {t("home.cta")}
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-base px-8">
                  {t("home.signIn")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Types */}
      <section className="py-12 border-b border-border/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium uppercase tracking-wider">{t("home.categories")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {wasteTypeKeys.map((w) => (
              <span key={w.key} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-sm font-medium">
                <span className={`w-3 h-3 rounded-full ${w.color}`} />
                {t(w.key)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{t("home.howItWorks")}</h2>
            <p className="text-muted-foreground text-lg">{t("home.howItWorksDesc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureKeys.map((f, i) => (
              <div key={f.titleKey} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="eco-gradient w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{t(f.titleKey)}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Recycle className="h-5 w-5 text-primary" />
            <span className="font-display font-bold text-gradient">RecycAI</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("home.footer")}</p>
        </div>
      </footer>
    </div>
  );
}
