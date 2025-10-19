import { Link } from "@tanstack/react-router";
import { Heart, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-out rounded-full group"
      activeProps={{
        className: "text-primary bg-primary/10",
      }}
      inactiveProps={{
        className: "text-muted-foreground hover:text-foreground hover:bg-accent/50",
      }}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );
};

export const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full py-4 px-4 backdrop-blur-lg bg-background/80 border-b border-border/50">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-center">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm">
            <NavLink to="/">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t("header.artists")}
              </span>
            </NavLink>
            <NavLink to="/favorites">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                {t("header.favorites")}
              </span>
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};