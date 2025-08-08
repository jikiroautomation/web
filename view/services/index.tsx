"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Package } from "lucide-react";
import { useTranslations } from "next-intl";

const ServicesView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const t = useTranslations("services.management");
  const tPublic = useTranslations("services.public");

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

  return (
    <div className="space-y-8">
      {/* Section 1: Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">{tPublic("title")}</h1>
        <p className="text-muted-foreground text-xs">
          {tPublic("description")}
        </p>
      </div>

      {/* Section 1: Search & Filter */}
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
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t("sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("sortByName")}</SelectItem>
            <SelectItem value="newest">{t("sortByNewest")}</SelectItem>
            <SelectItem value="oldest">{t("sortByOldest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section 2: Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-muted rounded-full p-6 mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm
                ? tPublic("noServicesFound")
                : tPublic("noServicesAvailable")}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              {searchTerm
                ? tPublic("noServicesMatchDescription")
                : tPublic("noServicesAvailableDescription")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card
              key={service._id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{service.emoji}</div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {service.name}
                    </CardTitle>
                  </div>
                </div>
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

export default ServicesView;
