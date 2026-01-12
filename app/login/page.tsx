"use client";

import { useState } from "react";
import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";

export default function LoginPage() {
  const { service, setUser } = useService();
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // In real app, password would be used
    const user = await service.login(email);

    if (user) {
      setUser(user);
      router.push('/dashboard');
    } else {
      alert("Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{t("login.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("login.email")}</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@masajed.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("login.password")}</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" disabled={loading}>
                {loading ? "..." : t("login.submit")}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-500">
              {t("login.register_prompt")} <a href="#" className="text-primary hover:underline">{t("login.register_link")}</a>
            </div>
            <div className="mt-6 p-3 bg-yellow-50 text-xs text-yellow-800 rounded border border-yellow-200">
               <strong>Demo Credentials:</strong><br/>
               Email: <code>imam@nour.com</code> (Supervisor)<br/>
               Or any email (creates temp user)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
