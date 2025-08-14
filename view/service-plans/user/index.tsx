"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import PlanItem from "./PlanItem";
import CheckoutCard from "./CheckoutCard";

interface ServicePlansUserViewProps {
  serviceId: string;
}

const ServicePlansUserView = ({ serviceId }: ServicePlansUserViewProps) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const service = useQuery(api.services.getServiceById, {
    serviceId: serviceId as Id<"services">,
  });

  const plans = useQuery(api.servicePlans.getActiveServicePlans, {
    serviceId: serviceId as Id<"services">,
  });

  const formatPrice = (price: number, period: string) => {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

    const periodText =
      {
        monthly: "/bulan",
        yearly: "/tahun",
        lifetime: "sekali bayar",
      }[period] || `/${period}`;

    return `${formattedPrice}${periodText}`;
  };

  if (!service || !plans) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-pulse bg-muted rounded-lg h-8 w-48 mx-auto" />
          <div className="animate-pulse bg-muted rounded h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/services"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Services
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">{service.name}</span>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Side - Service Info & Plans (8 columns) */}
        <div
          className={
            selectedPlan
              ? "xl:col-span-8 space-y-6"
              : "xl:col-span-12 space-y-6"
          }
        >
          {/* Service Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{service.emoji}</div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {service.name}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  {service.description}
                </p>
              </div>
            </div>
          </div>

          {/* Plans Section */}
          <div className="space-y-4">
            <div className="space-y-2 mb-10">
              <h2 className="text-lg sm:text-xl font-semibold">
                Pilih Plan yang Sesuai
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Temukan plan terbaik yang sesuai dengan kebutuhan Anda
              </p>
            </div>

            {plans.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="font-medium">Belum Ada Plan Tersedia</h3>
                    <p className="text-sm text-muted-foreground">
                      Plan untuk service ini sedang dalam persiapan. Silakan cek
                      kembali nanti.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div
                className={`grid gap-4 ${selectedPlan ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}
              >
                {plans
                  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((plan) => (
                    <PlanItem
                      key={plan._id}
                      plan={plan}
                      isSelected={selectedPlan?._id === plan._id}
                      onSelect={setSelectedPlan}
                      formatPrice={formatPrice}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Checkout Card (4 columns) */}
        {selectedPlan && (
          <div className="xl:col-span-4 order-first xl:order-last">
            <CheckoutCard
              selectedPlan={selectedPlan}
              serviceId={serviceId}
              onClose={() => setSelectedPlan(null)}
              onSuccess={() => {
                // Refresh page or show success state
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePlansUserView;
