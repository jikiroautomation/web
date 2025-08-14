import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Check, Crown } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import PaymentConfirmDialog from "@/components/dialogs/PaymentConfirmDialog";
import { useRouter } from "next/navigation";

interface CheckoutCardProps {
  selectedPlan: any;
  serviceId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const CheckoutCard = ({
  selectedPlan,
  serviceId,
  onClose,
  onSuccess,
}: CheckoutCardProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const router = useRouter();
  const createEnrollment = useMutation(api.enrolledServices.createEnrollment);
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

  const handlePayment = async () => {
    try {
      await createEnrollment({
        serviceId: serviceId as Id<"services">,
        planId: selectedPlan._id,
        isTestMode: true,
        paymentMethod: "manual",
        notes: "Testing enrollment from user interface",
      });

      toast("Anda telah berhasil berlangganan. Selamat menikmati layanan!");

      router.push("/projects");

      setShowConfirmDialog(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Enrollment error:", error);
      toast("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
    }
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
          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowConfirmDialog(true)}
          >
            Lanjutkan Pembayaran
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Pilih Plan Lain
          </Button>
        </div>
      </CardContent>

      <PaymentConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        plan={selectedPlan}
        onConfirm={handlePayment}
      />
    </Card>
  );
};

export default CheckoutCard;
