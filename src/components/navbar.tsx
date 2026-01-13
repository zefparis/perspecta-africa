"use client";

import { Link } from "@/navigation";
import { ThemeToggle } from "./theme-toggle";
import LanguageSwitcher from "./language-switcher";
import { useTranslations } from "next-intl";

export function Navbar() {
  const t = useTranslations("Index");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl hidden sm:inline-block">
              {t("title")}
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
