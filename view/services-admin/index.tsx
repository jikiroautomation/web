"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { Toaster } from "sonner";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import ServiceDialog from "@/components/dialogs/ServiceDialog";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import ServiceItem from "./ServiceItem";
import { Id } from "../../convex/_generated/dataModel";

interface Service {
  _id: Id<"services">;
  name: string;
  description: string;
  emoji: string;
  createdAt: number;
  updatedAt: number;
}

const ServicesAdminView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [serviceDialog, setServiceDialog] = useState<{
    isOpen: boolean;
    mode: "create" | "update";
    service?: Service;
  }>({
    isOpen: false,
    mode: "create",
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null,
  });

  const t = useTranslations("services.management");
  const tCommon = useTranslations("common");

  const services = useQuery(api.services.getAllServices) || [];

  // Filter and sort services
  const filteredServices = services
    .filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      if (sortBy === "oldest") return a.createdAt - b.createdAt;
      return 0;
    });

  const handleCreateService = () => {
    setServiceDialog({
      isOpen: true,
      mode: "create",
    });
  };

  const handleEditService = (service: Service) => {
    setServiceDialog({
      isOpen: true,
      mode: "update",
      service,
    });
  };

  const handleDeleteService = (service: Service) => {
    setDeleteDialog({
      isOpen: true,
      service,
    });
  };

  const closeServiceDialog = () => {
    setServiceDialog({
      isOpen: false,
      mode: "create",
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      service: null,
    });
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-xs">{t("description")}</p>
        </div>
        <Button
          onClick={handleCreateService}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t("createService")}
        </Button>
      </div>

      {/* Section 2: Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="full py-[18px]">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("sortByName")}</SelectItem>
            <SelectItem value="newest">{t("sortByNewest")}</SelectItem>
            <SelectItem value="oldest">{t("sortByOldest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section 3: Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold mb-2">
              {t("noServicesFound")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? t("noServicesMatch") : t("getStarted")}
            </p>
            <Button
              onClick={handleCreateService}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t("createFirst")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceItem
              key={service._id}
              service={service}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <ServiceDialog
        isOpen={serviceDialog.isOpen}
        onClose={closeServiceDialog}
        service={serviceDialog.service}
        mode={serviceDialog.mode}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        service={deleteDialog.service}
      />

      {/* Toast Container */}
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default ServicesAdminView;
