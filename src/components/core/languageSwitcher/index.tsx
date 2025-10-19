import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    { code: "pt", label: "Português" },
    { code: "en", label: "English" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  return (
    <div className="fixed right-2 bottom-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Globe className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Trocar idioma</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={
                currentLanguage.code === lang.code ? "bg-accent" : undefined
              }
            >
              {lang.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

