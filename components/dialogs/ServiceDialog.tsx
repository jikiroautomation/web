"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import EmojiPicker from "emoji-picker-react";
import { Loader2, Smile } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface Service {
  _id: Id<"services">;
  name: string;
  description: string;
  emoji: string;
}

interface ServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service?: Service;
  mode: "create" | "update";
}

export default function ServiceDialog({
  isOpen,
  onClose,
  service,
  mode,
}: ServiceDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createService = useMutation(api.services.createService);
  const updateService = useMutation(api.services.updateService);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mode === "update" && service) {
      setName(service.name);
      setDescription(service.description);
      setEmoji(service.emoji);
    } else {
      setName("");
      setDescription("");
      setEmoji("");
    }
    setErrors({});
  }, [service, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!emoji.trim()) {
      newErrors.emoji = "Emoji is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === "create") {
        await createService({
          name: name.trim(),
          description: description.trim(),
          emoji: emoji.trim(),
        });
        toast.success("Service created successfully!");
      } else if (mode === "update" && service) {
        await updateService({
          serviceId: service._id,
          name: name.trim(),
          description: description.trim(),
          emoji: emoji.trim(),
        });
        toast.success("Service updated successfully!");
      }

      onClose();
    } catch (error) {
      toast.error(`Failed to ${mode} service`);
      console.error(`Error ${mode}ing service:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Service" : "Update Service"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new service for your platform"
              : "Update the service information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emoji">Emoji</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-12 h-12 p-0 text-2xl"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {emoji || <Smile className="h-5 w-5" />}
              </Button>
              <Input
                id="emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🎯"
                className="flex-1"
                maxLength={2}
              />
            </div>
            {errors.emoji && (
              <p className="text-sm text-red-500">{errors.emoji}</p>
            )}
            {showEmojiPicker && (
              <div className="absolute z-10 mt-2">
                <EmojiPicker
                  onEmojiClick={handleEmojiSelect}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter service name"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter service description"
              disabled={isLoading}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "create" ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
