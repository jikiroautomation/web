"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Service {
  _id: Id<"services">;
  name: string;
  description: string;
  emoji: string;
}

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function DeleteConfirmDialog({
  isOpen,
  onClose,
  service,
}: DeleteConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("services.management");
  const tCommon = useTranslations("common");

  const deleteService = useMutation(api.services.deleteService);

  const handleDelete = async () => {
    if (!service) return;

    setIsLoading(true);

    try {
      await deleteService({
        serviceId: service._id,
      });
      toast.success("Service deleted successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to delete service");
      console.error("Error deleting service:", error);
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
            {t("deleteService")}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this service? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        {service && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 my-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{service.emoji}</span>
              <div>
                <h4 className="font-semibold">{service.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {tCommon("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}