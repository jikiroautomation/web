"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { Toaster } from "sonner";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, ArrowLeft } from "lucide-react";
import { Id } from "../../../convex/_generated/dataModel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlanDeleteDialog from "@/components/dialogs/PlanDeleteDialog";

interface ServicePlan {
  _id: Id<"servicePlans">;
  serviceId: Id<"services">;
  planName: string;
  description: string;
  price: number;
  billingPeriod: "monthly" | "yearly" | "lifetime";
  items: string[];
  isPopular?: boolean;
  sortOrder?: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

interface ServicePlansViewProps {
  serviceId: string;
}

const ServicePlansView = ({ serviceId }: ServicePlansViewProps) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("sortOrder");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    plan: ServicePlan | null;
  }>({
    isOpen: false,
    plan: null,
  });

  const service = useQuery(api.services.getServiceById, {
    serviceId: serviceId as Id<"services">,
  });

  const plans =
    useQuery(api.servicePlans.getServicePlansByServiceId, {
      serviceId: serviceId as Id<"services">,
    }) || [];

  const filteredPlans = plans
    .filter(
      (plan) =>
        plan.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "sortOrder")
        return (a.sortOrder || 0) - (b.sortOrder || 0);
      if (sortBy === "name") return a.planName.localeCompare(b.planName);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "newest") return b.createdAt - a.createdAt;
      return 0;
    });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getBillingPeriodText = (period: string) => {
    switch (period) {
      case "monthly":
        return "/bulan";
      case "yearly":
        return "/tahun";
      case "lifetime":
        return " selamanya";
      default:
        return "";
    }
  };

  const handleCreatePlan = () => {
    router.push(`/admin/services/${serviceId}/plans/new`);
  };

  const handleEditPlan = (planId: string) => {
    router.push(`/admin/services/${serviceId}/plans/${planId}/edit`);
  };

  const handleDeletePlan = (plan: ServicePlan) => {
    setDeleteDialog({
      isOpen: true,
      plan,
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      plan: null,
    });
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <h3 className="text-lg font-semibold mb-2">Loading...</h3>
          <p className="text-muted-foreground">Getting service information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/admin/services"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Services
          </Link>
          <span>/</span>
          <span>{service.name}</span>
          <span>/</span>
          <span>Plans</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{service.emoji}</span>
              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  {service.name} Plans
                </h1>
                <p className="text-muted-foreground text-xs">
                  Manage pricing plans for this service
                </p>
              </div>
            </div>
          </div>
          <Button
            onClick={handleCreatePlan}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Plan
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search plans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="full py-[18px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sortOrder">Sort Order</SelectItem>
            <SelectItem value="name">Plan Name</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredPlans.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">No Plans Found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "No plans match your search criteria."
                : "Get started by creating your first pricing plan for this service."}
            </p>
            <Button
              onClick={handleCreatePlan}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <Card
              key={plan._id}
              className={`relative ${plan.isPopular ? "border-primary shadow-md" : ""}`}
            >
              {plan.isPopular && (
                <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{plan.planName}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditPlan(plan._id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeletePlan(plan)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center py-4 border rounded-lg bg-muted/30">
                  <div className="text-3xl font-bold">
                    {plan.price === 0 ? (
                      "FREE"
                    ) : (
                      <>
                        {formatPrice(plan.price)}
                        <span className="text-sm font-normal text-muted-foreground">
                          {getBillingPeriodText(plan.billingPeriod)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Features:</h4>
                  <ul className="space-y-1">
                    {plan.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Status: {plan.isActive ? "Active" : "Inactive"}</span>
                    <span>Order: {plan.sortOrder || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <PlanDeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        plan={deleteDialog.plan}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
};

export default ServicePlansView;
