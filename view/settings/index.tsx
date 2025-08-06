"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { useUserProfile } from "@/hooks/use-user-profile";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { CheckCircle, User, Mail, Phone } from "lucide-react";

const SettingsView = () => {
  const { user } = useUser();
  const { userProfile, needsProfileSetup } = useUserProfile();
  const upsertUser = useMutation(api.users.upsertUser);
  const updateUser = useMutation(api.users.updateUser);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
      });
    } else if (user) {
      setFormData({
        name: user.fullName || "",
        phone: user.phoneNumbers[0]?.phoneNumber || "",
      });
    }
  }, [userProfile, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (needsProfileSetup || !userProfile) {
        await upsertUser({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: formData.name,
          phone: formData.phone,
        });
      } else {
        await updateUser({
          name: formData.name,
          phone: formData.phone,
        });
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Gagal menyimpan profile. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Pengaturan Profile</h1>
        <p className="text-gray-600 mt-2 text-xs">
          Kelola informasi profile dan preferensi akun Anda.
        </p>
      </div>

      {success && (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>Profile berhasil disimpan!</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Informasi Profile</h2>
          <p className="text-xs text-gray-600">
            Lengkapi informasi dasar profile Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                value={user?.primaryEmailAddress?.emailAddress || ""}
                disabled
                className="pl-10 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-500">
              Email dikelola oleh sistem authentication dan tidak dapat diubah.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contoh: +6281234567890"
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Format: +62 diikuti nomor telepon (contoh: +6281234567890)
            </p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={
                isLoading || !formData.name.trim() || !formData.phone.trim()
              }
              className="w-full sm:w-auto"
            >
              {isLoading
                ? "Menyimpan..."
                : needsProfileSetup
                  ? "Buat Profile"
                  : "Update Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsView;
