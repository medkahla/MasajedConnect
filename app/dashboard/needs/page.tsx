"use client";

import { useEffect, useState } from "react";
import { useService } from "@/lib/ServiceContext";
import { useLanguage } from "@/lib/LanguageContext";
import { Need, NeedCategory, NeedStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";

const NEED_CATEGORIES: NeedCategory[] = [
  "ELECTRICIAN",
  "PLUMBER",
  "LABOR",
  "FINANCING",
  "CONSTRUCTION",
  "CLEANING",
  "OTHER",
];

export default function NeedsPage() {
  const { service, user } = useService();
  const { t } = useLanguage();
  const [needs, setNeeds] = useState<Need[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "OTHER" as NeedCategory,
    contactEmail: "",
  });

  const mosqueId = user?.managedMosqueId;

  useEffect(() => {
    if (mosqueId) {
      loadNeeds();
    }
  }, [mosqueId]);

  const loadNeeds = async () => {
    if (!mosqueId) return;
    setLoading(true);
    const data = await service.getNeedsByMosque(mosqueId);
    setNeeds(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mosqueId) return;

    await service.createNeed({
      ...formData,
      mosqueId,
      status: "OPEN",
    });

    setFormData({
      title: "",
      description: "",
      category: "OTHER",
      contactEmail: "",
    });
    setShowForm(false);
    loadNeeds();
  };

  const handleStatusChange = async (id: string, status: NeedStatus) => {
    await service.updateNeed(id, { status });
    loadNeeds();
  };

  const handleDelete = async (id: string) => {
    await service.deleteNeed(id);
    loadNeeds();
  };

  const getStatusBadge = (status: NeedStatus) => {
    const variants: Record<NeedStatus, "success" | "warning" | "secondary"> = {
      OPEN: "success",
      IN_PROGRESS: "warning",
      RESOLVED: "secondary",
    };
    return (
      <Badge variant={variants[status]}>
        {t(`need.status.${status.toLowerCase()}`)}
      </Badge>
    );
  };

  const getCategoryLabel = (category: NeedCategory) => {
    return t(`need.category.${category.toLowerCase()}`);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("dash.needs")}</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("need.add")}
        </Button>
      </div>

      {/* Add Need Form */}
      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t("need.add")}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("need.title")}
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("need.category")}
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as NeedCategory,
                    })
                  }
                >
                  {NEED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("need.description")}
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("need.contact")}
                </label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  {t("dash.cancel")}
                </Button>
                <Button type="submit">{t("dash.save")}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Needs List */}
      {needs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            {t("need.no_needs")}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {needs.map((need) => (
            <Card key={need.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">
                        {getCategoryLabel(need.category)}
                      </span>
                      {getStatusBadge(need.status)}
                    </div>
                    <h3 className="font-medium text-lg">{need.title}</h3>
                    <p className="text-gray-600 mt-1">{need.description}</p>
                    {need.contactEmail && (
                      <p className="text-sm text-gray-500 mt-2">
                        {t("need.contact")}: {need.contactEmail}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {need.status === "OPEN" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(need.id, "IN_PROGRESS")}
                      >
                        {t("need.mark_in_progress")}
                      </Button>
                    )}
                    {need.status !== "RESOLVED" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(need.id, "RESOLVED")}
                      >
                        {t("need.mark_resolved")}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(need.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
