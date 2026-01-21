"use client";

import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  Clock,
  LogOut,
  Wrench,
  Calendar,
  Globe,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser } = useService();
  const { t, direction, language, setLanguage } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const navItems = [
    { href: "/dashboard", label: t("dash.welcome"), icon: LayoutDashboard },
    { href: "/dashboard/profile", label: t("dash.profile"), icon: User },
    { href: "/dashboard/prayers", label: t("dash.prayers"), icon: Clock },
    { href: "/dashboard/needs", label: t("dash.needs"), icon: Wrench },
    { href: "/dashboard/events", label: t("dash.events"), icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex" dir={direction}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-e hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="font-bold text-xl text-primary">{t("app.title")}</h1>
          <p className="text-xs text-gray-500 uppercase mt-1">
            Supervisor Area
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${isActive ? "" : "text-gray-600"}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-3">
          {/* Language Selector */}
          <div className="flex items-center gap-2 justify-center">
            <Globe className="w-4 h-4 text-gray-500" />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={language === "ar" ? "default" : "outline"}
                className="px-2 py-1 text-xs"
                onClick={() => setLanguage("ar")}
              >
                عربي
              </Button>
              <Button
                size="sm"
                variant={language === "fr" ? "default" : "outline"}
                className="px-2 py-1 text-xs"
                onClick={() => setLanguage("fr")}
              >
                FR
              </Button>
              <Button
                size="sm"
                variant={language === "en" ? "default" : "outline"}
                className="px-2 py-1 text-xs"
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => {
              setUser(null);
              router.push("/");
            }}
          >
            <LogOut className="w-4 h-4" />
            {t("nav.logout")}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b flex items-center px-4 justify-between">
          <span className="font-bold">Masajed Dashboard</span>
          <Link href="/dashboard/profile">
            <User />
          </Link>
        </div>

        <div className="p-4 md:p-8 max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
