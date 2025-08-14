"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

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

interface PlanDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ServicePlan | null;
}

export default function PlanDeleteDialog({
  isOpen,
  onClose,
  plan,
}: PlanDeleteDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const deletePlan = useMutation(api.servicePlans.deleteServicePlan);

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
      case "monthly": return "/bulan";
      case "yearly": return "/tahun";
      case "lifetime": return " selamanya";
      default: return "";
    }
  };

  const handleDelete = async () => {
    if (!plan) return;

    setIsLoading(true);

    try {
      await deletePlan({
        planId: plan._id,
      });
      toast.success("Plan deleted successfully!");
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete plan");
      console.error("Error deleting plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete Plan
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this pricing plan? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {plan && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 my-4">
            <div className="space-y-3">
              {/* Plan Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">{plan.planName}</h4>
                  <div className="flex items-center gap-2">
                    {plan.isPopular && (
                      <Badge className="text-xs">Most Popular</Badge>
                    )}
                    <Badge variant={plan.isActive ? "default" : "secondary"} className="text-xs">
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-center py-2 border rounded bg-muted/50">
                <div className="text-2xl font-bold">
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

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>

              {/* Features Preview */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Features ({plan.items.length}):
                </p>
                <div className="max-h-20 overflow-y-auto">
                  <ul className="space-y-1">
                    {plan.items.slice(0, 3).map((item, index) => (
                      <li key={index} className="flex items-start gap-1 text-xs">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                    {plan.items.length > 3 && (
                      <li className="text-xs text-muted-foreground pl-4">
                        ... and {plan.items.length - 3} more features
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Trash2 className="h-4 w-4 text-red-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-red-800 dark:text-red-200">Warning</p>
              <p className="text-red-700 dark:text-red-300 mt-1">
                This will permanently delete the plan and cannot be undone. Consider deactivating the plan instead if you might need it later.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}