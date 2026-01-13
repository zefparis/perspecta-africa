"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative">
      <select
        defaultValue={locale}
        className="bg-transparent py-2 pl-3 pr-8 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
        onChange={onSelectChange}
        disabled={isPending}
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="pt">PT</option>
      </select>
    </div>
  );
}
