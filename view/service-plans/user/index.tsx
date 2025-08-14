"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Crown } from "lucide-react";
import Link from "next/link";

interface ServicePlansUserViewProps {
  serviceId: string;
}

interface CheckoutCardProps {
  selectedPlan: any;
  onClose: () => void;
}

const CheckoutCard = ({ selectedPlan, onClose }: CheckoutCardProps) => {
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

  return (
    <Card className="sticky top-4 xl:top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg">Checkout</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {selectedPlan.isPopular && (
              <Crown className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-base">
                {selectedPlan.planName}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {selectedPlan.description}
              </p>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Harga</span>
              <span className="text-lg font-bold">
                {formatPrice(selectedPlan.price, selectedPlan.billingPeriod)}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium text-sm">Yang Anda Dapatkan:</h4>
          <ul className="space-y-2">
            {selectedPlan.items.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <Button className="w-full" size="lg">
            Lanjutkan Pembayaran
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Pilih Plan Lain
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

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
        <div className={selectedPlan ? "xl:col-span-8 space-y-6" : "xl:col-span-12 space-y-6"}>
          {/* Service Header */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="text-3xl flex-shrink-0">{service.emoji}</div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {service.name}
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">{service.description}</p>
              </div>
            </div>
          </div>

          {/* Plans Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-semibold">Pilih Plan yang Sesuai</h2>
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
              <div className={`grid gap-4 ${selectedPlan ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                {plans
                  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                  .map((plan) => (
                    <Card
                      key={plan._id}
                      className={`relative cursor-pointer transition-all hover:shadow-md ${
                        selectedPlan?._id === plan._id
                          ? "ring-2 ring-primary shadow-md"
                          : "hover:shadow-lg"
                      }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      {plan.isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-yellow-500 text-yellow-50 hover:bg-yellow-600">
                            <Crown className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <CardTitle className="text-base sm:text-lg leading-tight">
                          {plan.planName}
                        </CardTitle>
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          {formatPrice(plan.price, plan.billingPeriod)}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {plan.description}
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-3 pt-0">
                        <ul className="space-y-1.5">
                          {plan.items
                            .slice(0, 4)
                            .map((item: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-2 text-xs sm:text-sm"
                              >
                                <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          {plan.items.length > 4 && (
                            <li className="text-xs sm:text-sm text-muted-foreground pl-5">
                              +{plan.items.length - 4} fitur lainnya
                            </li>
                          )}
                        </ul>

                        <Button
                          className="w-full text-xs sm:text-sm"
                          size="sm"
                          variant={
                            selectedPlan?._id === plan._id
                              ? "default"
                              : "outline"
                          }
                        >
                          {selectedPlan?._id === plan._id
                            ? "Terpilih"
                            : "Pilih Plan"}
                        </Button>
                      </CardContent>
                    </Card>
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
              onClose={() => setSelectedPlan(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicePlansUserView;
