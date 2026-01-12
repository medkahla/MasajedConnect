"use client";

import { use, useEffect, useState } from "react";
import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Mosque, PrayerTimes, Need, MosqueEvent } from "@/lib/types";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Wrench, Calendar, Mail } from "lucide-react";

export default function MosquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { service } = useService();
  const { t } = useLanguage();
  const [mosque, setMosque] = useState<Mosque | undefined>(undefined);
  const [prayers, setPrayers] = useState<PrayerTimes | undefined>(undefined);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [events, setEvents] = useState<MosqueEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (id) {
      Promise.all([
        service.getMosqueById(id),
        service.getPrayerTimes(id),
        service.getNeedsByMosque(id),
        service.getEventsByMosque(id),
      ]).then(([m, p, n, e]) => {
        if (mounted) {
          setMosque(m);
          setPrayers(p);
          // Filter only non-resolved needs
          setNeeds(n.filter((need) => need.status !== "RESOLVED"));
          // Filter future events and sort by date
          const today = new Date().toISOString().split("T")[0];
          setEvents(
            e
              .filter((ev) => ev.date >= today)
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              ),
          );
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [id, service]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  if (loading) return <div>Loading...</div>;
  if (!mosque) return <div>Mosque not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Banner */}
      <div className="h-64 bg-gray-200 relative">
        {mosque.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mosque.imageUrl}
            alt={mosque.name}
            className="w-full h-full object-cover"
          />
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
                {mosque.services.map((s) => (
                  <span
                    key={s}
                    className="bg-secondary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {s.replace("_", " ")}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Needs Section */}
          {needs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  {t("mosque.needs")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {needs.map((need) => (
                  <div
                    key={need.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={need.status === "OPEN" ? "success" : "warning"}
                      >
                        {t(`need.category.${need.category.toLowerCase()}`)}
                      </Badge>
                      <Badge variant="secondary">
                        {t(`need.status.${need.status.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{need.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {need.description}
                    </p>
                    {need.contactEmail && (
                      <a
                        href={`mailto:${need.contactEmail}`}
                        className="inline-flex items-center gap-1 text-sm text-primary mt-2 hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {t("common.contact")}
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Events Section */}
          {events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("mosque.events")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(event.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <Badge variant="default">
                        {t(`event.category.${event.category.toLowerCase()}`)}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
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
                      <th className="p-3 text-end">
                        {t("prayer.iqamah")} (+min)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as const).map(
                      (p) => (
                        <tr key={p} className="hover:bg-gray-50">
                          <td className="p-3 font-medium flex justify-between">
                            <span>{t(`prayer.${p}`)}</span>
                            <span className="font-bold">{prayers[p]}</span>
                          </td>
                          <td className="p-3 text-end text-gray-500">
                            +{prayers.iqamahOffsets[p]} min
                          </td>
                        </tr>
                      ),
                    )}
                    <tr className="bg-primary/5 font-bold text-primary">
                      <td className="p-3">{t("prayer.jumuah")}</td>
                      <td className="p-3 text-end">{prayers.jumuah}</td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No prayer times available.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
