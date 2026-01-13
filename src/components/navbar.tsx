"use client";

import { Link } from "@/navigation";
import { ThemeToggle } from "./theme-toggle";
import LanguageSwitcher from "./language-switcher";
import { useTranslations } from "next-intl";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const t = useTranslations();
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl hidden sm:inline-block">
              {t("Index.title")}
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          
          {session ? (
            <div className="flex items-center gap-2">
               <Link href="/profile" className="text-sm font-medium hover:underline">
                  {session.user?.name || t("Profile.title")}
               </Link>
               <button
                 onClick={() => signOut()}
                 className="text-sm font-medium text-red-500 hover:text-red-600"
               >
                 {t("Auth.signout")}
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("Auth.signin")}
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {t("Auth.signup")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
