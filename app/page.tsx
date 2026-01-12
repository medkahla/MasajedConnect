"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Mosque, Need, MosqueEvent } from "@/lib/types";
import { Header } from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Wrench, Calendar, Clock, Mail } from "lucide-react";

// Dynamically import map with no SSR
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      Loading Map...
    </div>
  ),
});

export default function Home() {
  const { service } = useService();
  const { t } = useLanguage();
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [events, setEvents] = useState<MosqueEvent[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    service.getMosques().then(setMosques);
    service.getNeeds().then((allNeeds) => {
      // Filter only OPEN needs and take latest 6
      setNeeds(allNeeds.filter((n) => n.status === "OPEN").slice(0, 6));
    });
    service.getEvents().then((allEvents) => {
      // Filter future events and take next 6
      const today = new Date().toISOString().split("T")[0];
      setEvents(
        allEvents
          .filter((e) => e.date >= today)
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .slice(0, 6),
      );
    });
  }, [service]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const filteredMosques = mosques.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-primary/5 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>

          <div className="flex max-w-lg mx-auto gap-2">
            <Input
              placeholder={t("search.placeholder")}
              className="bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button>{t("search.action")}</Button>
          </div>
        </div>
      </section>

      {/* Main Content: Map + List */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* List View */}
          <div className="lg:col-span-1 overflow-y-auto pe-2 space-y-4">
            <h2 className="font-bold text-xl mb-4">{t("featured.mosques")}</h2>
            {filteredMosques.map((mosque) => (
              <Card
                key={mosque.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                    {mosque.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mosque.imageUrl}
                        alt={mosque.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <MapPin className="w-8 h-8 m-auto text-gray-400 mt-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight">
                      {mosque.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{mosque.city}</p>
                    <Link href={`/mosque/${mosque.id}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        {t("list.view")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredMosques.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                No mosques found.
              </p>
            )}
          </div>

          {/* Map View */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border h-[400px] lg:h-auto">
            <Map mosques={filteredMosques} />
          </div>
        </div>
      </main>

      {/* Needs Section */}
      {needs.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Wrench className="w-6 h-6 text-primary" />
              {t("mosque.needs")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {needs.map((need) => {
                const mosque = mosques.find((m) => m.id === need.mosqueId);
                return (
                  <Card
                    key={need.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="success">
                          {t(`need.category.${need.category.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <h3 className="font-semibold">{need.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {need.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <Link
                          href={`/mosque/${need.mosqueId}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {mosque?.name || "Mosque"}
                        </Link>
                        {need.contactEmail && (
                          <a
                            href={`mailto:${need.contactEmail}`}
                            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary"
                          >
                            <Mail className="w-4 h-4" />
                            {t("common.contact")}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Events Section */}
      {events.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              {t("mosque.events")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => {
                const mosque = mosques.find((m) => m.id === event.mosqueId);
                return (
                  <Card
                    key={event.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                      </div>
                      <Badge variant="default" className="mb-2">
                        {t(`event.category.${event.category.toLowerCase()}`)}
                      </Badge>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {event.description}
                      </p>
                      <Link
                        href={`/mosque/${event.mosqueId}`}
                        className="text-sm text-primary hover:underline mt-3 inline-block"
                      >
                        {mosque?.name || "Mosque"}
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
