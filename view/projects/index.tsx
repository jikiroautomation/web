"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";

const ProjectsView = () => {
  const enrolledServices = useQuery(api.enrolledServices.getUserEnrolledServicesWithDetails);

  const formatPrice = (price: number, period: string) => {
    const formattedPrice = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

    const periodText = {
      monthly: "/bulan",
      yearly: "/tahun", 
      lifetime: "sekali bayar",
    }[period] || `/${period}`;

    return `${formattedPrice}${periodText}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Aktif", variant: "default", icon: CheckCircle },
      pending: { label: "Pending", variant: "secondary", icon: Clock },
      expired: { label: "Expired", variant: "destructive", icon: XCircle },
      cancelled: { label: "Dibatalkan", variant: "outline", icon: XCircle },
      failed: { label: "Gagal", variant: "destructive", icon: AlertCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: string) => {
    const statusConfig = {
      paid: { label: "Lunas", variant: "default" },
      pending: { label: "Pending", variant: "secondary" },
      failed: { label: "Gagal", variant: "destructive" },
      refunded: { label: "Refund", variant: "outline" },
      test: { label: "Test", variant: "secondary" },
    };

    const config = statusConfig[paymentStatus as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    );
  };

  if (enrolledServices === undefined) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Kelola layanan yang sudah Anda berlangganan
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (enrolledServices.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Kelola layanan yang sudah Anda berlangganan
          </p>
        </div>

        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <div className="text-4xl">📋</div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Belum Ada Layanan</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Anda belum berlangganan layanan apapun. Mulai dengan menjelajahi 
                layanan yang tersedia dan pilih yang sesuai dengan kebutuhan Anda.
              </p>
            </div>
            <Button asChild>
              <a href="/services">Jelajahi Layanan</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Kelola layanan yang sudah Anda berlangganan ({enrolledServices.length} layanan)
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrolledServices.map((enrollment) => (
          <Card key={enrollment._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="text-2xl flex-shrink-0">
                    {enrollment.service?.emoji || "📦"}
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-base leading-tight truncate">
                      {enrollment.service?.name || "Unknown Service"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {enrollment.plan?.planName || "Unknown Plan"}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(enrollment.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Harga</span>
                  <span className="font-medium">
                    {formatPrice(enrollment.amount, enrollment.billingPeriod)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pembayaran</span>
                  {getPaymentStatusBadge(enrollment.paymentStatus)}
                </div>

                <div className="flex items-start justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Mulai
                  </span>
                  <span className="text-right">
                    {formatDate(enrollment.startDate)}
                  </span>
                </div>

                {enrollment.endDate && (
                  <div className="flex items-start justify-between text-sm">
                    <span className="text-muted-foreground">Berakhir</span>
                    <span className="text-right">
                      {formatDate(enrollment.endDate)}
                    </span>
                  </div>
                )}

                {enrollment.paymentMethod && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      Metode
                    </span>
                    <span className="capitalize">
                      {enrollment.paymentMethod}
                    </span>
                  </div>
                )}
              </div>

              {enrollment.status === "active" && (
                <Button size="sm" className="w-full">
                  Kelola Layanan
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectsView;
