"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";

interface PaymentConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
  onConfirm: () => void;
  loading?: boolean;
}

const PaymentConfirmDialog = ({
  open,
  onOpenChange,
  plan,
  onConfirm,
  loading = false,
}: PaymentConfirmDialogProps) => {
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

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Konfirmasi Pembayaran
            {plan.isPopular && (
              <Crown className="h-4 w-4 text-yellow-500" />
            )}
          </DialogTitle>
          <DialogDescription>
            Anda akan berlangganan plan berikut. Pastikan pilihan Anda sudah tepat.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold">{plan.planName}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {plan.description}
                </p>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {formatPrice(plan.price, plan.billingPeriod)}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Fitur yang termasuk:</h4>
              <ul className="space-y-1">
                {plan.items.slice(0, 3).map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
                {plan.items.length > 3 && (
                  <li className="text-sm text-muted-foreground pl-5">
                    +{plan.items.length - 3} fitur lainnya
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Ini adalah mode testing. Pembayaran akan disimulasi 
              dan layanan akan langsung aktif.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={loading}
          >
            {loading ? "Memproses..." : "Ya, Lanjutkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentConfirmDialog;