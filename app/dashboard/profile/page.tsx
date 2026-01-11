"use client";

import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";
import { Mosque } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { service, user } = useService();
  const { t } = useLanguage();
  const [mosque, setMosque] = useState<Mosque | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.managedMosqueId) {
      service.getMosqueById(user.managedMosqueId).then(m => setMosque(m || null));
    }
  }, [user, service]);

  const handleSave = async () => {
    if (mosque && user?.managedMosqueId) {
       setLoading(true);
       await service.updateMosqueProfile(user.managedMosqueId, mosque);
       setLoading(false);
       alert("Saved!");
    }
  };

  if (!mosque) return <div>Loading mosque details...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("dash.profile")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>General Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
               <label className="text-sm font-medium">Name</label>
               <Input value={mosque.name} onChange={e => setMosque({...mosque, name: e.target.value})} />
            </div>
            <div>
               <label className="text-sm font-medium">City</label>
               <Input value={mosque.city} onChange={e => setMosque({...mosque, city: e.target.value})} />
            </div>
            <div className="md:col-span-2">
               <label className="text-sm font-medium">Address</label>
               <Input value={mosque.address} onChange={e => setMosque({...mosque, address: e.target.value})} />
            </div>
            <div className="md:col-span-2">
               <label className="text-sm font-medium">Description</label>
               <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  value={mosque.description}
                  onChange={e => setMosque({...mosque, description: e.target.value})}
               />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={loading}>{t("dash.save")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
