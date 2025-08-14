"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";

interface NewPlanViewProps {
  serviceId: string;
}

interface FormData {
  planName: string;
  description: string;
  price: string;
  billingPeriod: "monthly" | "yearly" | "lifetime";
  items: string[];
  isPopular: boolean;
  sortOrder: string;
}

interface FormErrors {
  planName?: string;
  description?: string;
  price?: string;
  items?: string;
  sortOrder?: string;
}

const NewPlanView = ({ serviceId }: NewPlanViewProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    planName: "",
    description: "",
    price: "0",
    billingPeriod: "monthly",
    items: [],
    isPopular: false,
    sortOrder: "0",
  });

  const service = useQuery(api.services.getServiceById, { 
    serviceId: serviceId as Id<"services"> 
  });

  const createPlan = useMutation(api.servicePlans.createServicePlan);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.planName.trim()) {
      newErrors.planName = "Plan name is required";
    } else if (formData.planName.trim().length < 2) {
      newErrors.planName = "Plan name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price < 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (formData.items.length === 0) {
      newErrors.items = "At least one feature is required";
    }

    const sortOrder = parseInt(formData.sortOrder);
    if (isNaN(sortOrder) || sortOrder < 0) {
      newErrors.sortOrder = "Sort order must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddItem = () => {
    if (newItem.trim()) {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem.trim()]
      }));
      setNewItem("");
      if (errors.items) {
        setErrors(prev => ({ ...prev, items: undefined }));
      }
    }
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setIsSubmitting(true);

    try {
      await createPlan({
        serviceId: serviceId as Id<"services">,
        planName: formData.planName.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        billingPeriod: formData.billingPeriod,
        items: formData.items,
        isPopular: formData.isPopular,
        sortOrder: parseInt(formData.sortOrder),
      });

      toast.success("Plan created successfully!");
      router.push(`/admin/services/${serviceId}/plans`);
    } catch (error: any) {
      console.error("Error creating plan:", error);
      toast.error(error.message || "Failed to create plan. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="text-6xl mb-4">=</div>
          <h3 className="text-lg font-semibold mb-2">Loading...</h3>
          <p className="text-muted-foreground">Getting service information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header with Breadcrumb */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link 
            href="/admin/services" 
            className="hover:text-foreground transition-colors"
          >
            Services
          </Link>
          <span>/</span>
          <Link 
            href={`/admin/services/${serviceId}/plans`}
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            {service.name} Plans
          </Link>
          <span>/</span>
          <span>New Plan</span>
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{service.emoji}</span>
            <h1 className="text-xl font-bold tracking-tight">Create New Plan</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Create a new pricing plan for {service.name}
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>
            Fill in the information for your new pricing plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Name */}
            <div className="space-y-2">
              <Label htmlFor="planName">Plan Name *</Label>
              <Input
                id="planName"
                placeholder="e.g., Free, Basic, Pro, Enterprise"
                value={formData.planName}
                onChange={(e) => handleInputChange("planName", e.target.value)}
                className={errors.planName ? "border-red-500" : ""}
              />
              {errors.planName && (
                <p className="text-sm text-red-500">{errors.planName}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what this plan offers..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Price and Billing Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (IDR) *</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={`pr-16 ${errors.price ? "border-red-500" : ""}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    IDR
                  </div>
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price}</p>
                )}
                {formData.price && !isNaN(parseFloat(formData.price)) && (
                  <p className="text-sm text-muted-foreground">
                    Preview: {formatPrice(parseFloat(formData.price))}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingPeriod">Billing Period</Label>
                <Select
                  value={formData.billingPeriod}
                  onValueChange={(value: "monthly" | "yearly" | "lifetime") =>
                    handleInputChange("billingPeriod", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Features *</Label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a feature..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!newItem.trim()}
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                
                {formData.items.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Features ({formData.items.length}):</p>
                    <div className="space-y-2">
                      {formData.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <span className="text-green-500"></span>
                            <span className="text-sm">{item}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {errors.items && (
                  <p className="text-sm text-red-500">{errors.items}</p>
                )}
              </div>
            </div>

            {/* Sort Order and Popular */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange("sortOrder", e.target.value)}
                  className={errors.sortOrder ? "border-red-500" : ""}
                />
                {errors.sortOrder && (
                  <p className="text-sm text-red-500">{errors.sortOrder}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isPopular">Popular Plan</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPopular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => handleInputChange("isPopular", checked)}
                  />
                  <Label htmlFor="isPopular" className="text-sm">
                    Mark as "Most Popular"
                  </Label>
                  {formData.isPopular && (
                    <Badge className="ml-2">Most Popular</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/services/${serviceId}/plans`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  "Create Plan"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPlanView;