"use client";

import { use, useEffect, useState } from "react";
import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Mosque, PrayerTimes } from "@/lib/types";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock } from "lucide-react";

export default function MosquePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { service } = useService();
  const { t } = useLanguage();
  const [mosque, setMosque] = useState<Mosque | undefined>(undefined);
  const [prayers, setPrayers] = useState<PrayerTimes | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (id) {
      Promise.all([
        service.getMosqueById(id),
        service.getPrayerTimes(id)
      ]).then(([m, p]) => {
        if (mounted) {
          setMosque(m);
          setPrayers(p);
          setLoading(false);
        }
      });
    }
    return () => { mounted = false; };
  }, [id, service]);

  if (loading) return <div>Loading...</div>;
  if (!mosque) return <div>Mosque not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Banner */}
      <div className="h-64 bg-gray-200 relative">
        {mosque.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mosque.imageUrl} alt={mosque.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end p-8">
          <div className="container mx-auto text-white">
            <h1 className="text-4xl font-bold mb-2">{mosque.name}</h1>
            <p className="flex items-center gap-2 text-lg opacity-90">
              <MapPin className="w-5 h-5" /> {mosque.address}, {mosque.city}
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Col: Info & Services */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{mosque.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("mosque.services")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mosque.services.map(s => (
                  <span key={s} className="bg-secondary px-3 py-1 rounded-full text-sm font-medium">
                    {s.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Prayer Times */}
        <div className="md:col-span-1">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-primary text-white rounded-t-lg pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Clock className="w-6 h-6" />
                {t("mosque.prayers")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               {prayers ? (
                 <table className="w-full text-sm">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="p-3 text-start">{t("prayer.adhan")}</th>
                       <th className="p-3 text-end">{t("prayer.iqamah")} (+min)</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y">
                     {(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const).map((p) => (
                       <tr key={p} className="hover:bg-gray-50">
                         <td className="p-3 font-medium flex justify-between">
                           <span>{t(`prayer.${p}`)}</span>
                           <span className="font-bold">{prayers[p]}</span>
                         </td>
                         <td className="p-3 text-end text-gray-500">
                           +{prayers.iqamahOffsets[p]} min
                         </td>
                       </tr>
                     ))}
                     <tr className="bg-primary/5 font-bold text-primary">
                        <td className="p-3">{t("prayer.jumuah")}</td>
                        <td className="p-3 text-end">{prayers.jumuah}</td>
                     </tr>
                   </tbody>
                 </table>
               ) : (
                 <div className="p-6 text-center text-gray-500">No prayer times available.</div>
               )}
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
}
