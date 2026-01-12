"use client";

import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useService();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("dash.welcome")}, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">Active</p>
            <p className="text-sm text-gray-600">Mosque verified</p>
          </CardContent>
        </Card>
      </div>

      <p className="text-gray-500">Select an option from the sidebar to manage your mosque.</p>
    </div>
  );
}
