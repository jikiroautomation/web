"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const ServicesAdminView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
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
    // TODO: Open create service dialog
    console.log("Create service clicked");
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-xs">
            {t("description")}
          </p>
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
            <h3 className="text-lg font-semibold mb-2">{t("noServicesFound")}</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? t("noServicesMatch")
                : t("getStarted")}
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
            <Card
              key={service._id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{service.emoji}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      {tCommon("edit")}
                    </Button>
                    <Button variant="destructive" size="sm">
                      {tCommon("delete")}
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesAdminView;
