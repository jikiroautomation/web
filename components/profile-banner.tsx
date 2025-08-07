import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ProfileBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const t = useTranslations("dashboard.profileBanner");

  if (!isVisible) return null;

  return (
    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
      <Info className="h-4 w-4 dark:text-neutral-700" />
      <div className="flex items-center justify-between">
        <AlertDescription className="flex-1">
          <span className="font-medium text-sm">{t("title")}</span>
          <br />
          {t("description")}
        </AlertDescription>
        <div className="flex items-center gap-2 ml-4">
          <Link href="/settings">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 dark:text-white"
            >
              {t("completeNow")}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  );
}
