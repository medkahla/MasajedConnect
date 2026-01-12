"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "./ui/button";
import Link from "next/link";
import { useService } from "@/lib/ServiceContext";
import { LogOut } from "lucide-react";

export function Header() {
  const { t, setLanguage, language } = useLanguage();
  const { user, setUser } = useService();

  const handleLogout = () => {
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">M</div>
           <span className="font-bold text-xl">{t("app.title")}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Language Switcher */}
          <div className="flex gap-1 text-xs">
            <button onClick={() => setLanguage('ar')} className={`px-2 py-1 rounded ${language === 'ar' ? 'bg-primary text-white' : 'hover:bg-accent'}`}>AR</button>
            <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-primary text-white' : 'hover:bg-accent'}`}>FR</button>
            <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded ${language === 'en' ? 'bg-primary text-white' : 'hover:bg-accent'}`}>EN</button>
          </div>

          {/* User / Login */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium hidden md:inline-block">{user.name}</span>
              <Link href="/dashboard">
                <Button size="sm" variant="outline">{t("nav.dashboard")}</Button>
              </Link>
              <Button size="icon" variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">{t("nav.login")}</Button>
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
