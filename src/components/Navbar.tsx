import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Recycle, Upload, LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar({ user }: { user: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navLinks = user
    ? [
        { to: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
        { to: "/upload", label: t("nav.upload"), icon: Upload },
      ]
    : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="eco-gradient p-2 rounded-lg transition-transform group-hover:scale-105">
            <Recycle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-gradient">RecycAI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button variant={isActive(link.to) ? "default" : "ghost"} size="sm" className="gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <LanguageSelector />
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 ml-1">
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </Button>
          ) : (
            <Link to="/login">
              <Button size="sm" className="eco-gradient text-primary-foreground ml-2">
                {t("nav.getStarted")}
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-border/50 p-4 space-y-2 animate-fade-in">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
              <Button variant={isActive(link.to) ? "default" : "ghost"} className="w-full justify-start gap-2">
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
          <div className="py-1">
            <LanguageSelector />
          </div>
          {user ? (
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </Button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button className="w-full eco-gradient text-primary-foreground">{t("nav.getStarted")}</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
