"use client";

import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useState, useEffect } from "react";
import { PrayerTimes } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrayerTimesPage() {
  const { service, user } = useService();
  const { t } = useLanguage();
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.managedMosqueId) {
      service.getPrayerTimes(user.managedMosqueId).then(t => setTimes(t || null));
    }
  }, [user, service]);

  const handleSave = async () => {
    if (times && user?.managedMosqueId) {
       setLoading(true);
       await service.updatePrayerTimes(user.managedMosqueId, times);
       setLoading(false);
       alert("Times updated!");
    }
  };

  if (!times) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("dash.prayers")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Daily Schedule</CardTitle>
          <p className="text-sm text-gray-500">Set the adhan time and the iqamah offset (minutes after adhan).</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map(p => (
               <div key={p} className="grid grid-cols-3 gap-4 items-center border-b pb-2 last:border-0">
                  <div className="font-medium capitalize">{p}</div>
                  <div>
                    <label className="text-xs text-gray-500">Adhan</label>
                    <Input
                      type="time"
                      value={times[p]}
                      onChange={e => setTimes({...times, [p]: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Iqamah Offset (min)</label>
                    <Input
                      type="number"
                      value={times.iqamahOffsets[p]}
                      onChange={e => setTimes({
                        ...times,
                        iqamahOffsets: {...times.iqamahOffsets, [p]: parseInt(e.target.value) || 0}
                      })}
                    />
                  </div>
               </div>
             ))}

             <div className="pt-4 border-t">
               <div className="grid grid-cols-3 gap-4 items-center">
                 <div className="font-bold">Jumu&apos;ah</div>
                 <div>
                   <label className="text-xs text-gray-500">Khutbah Time</label>
                   <Input
                      type="time"
                      value={times.jumuah}
                      onChange={e => setTimes({...times, jumuah: e.target.value})}
                    />
                 </div>
               </div>
             </div>
          </div>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSave} disabled={loading}>{t("dash.save")}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
