"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown } from "lucide-react";

interface Plan {
  _id: string;
  planName: string;
  description: string;
  price: number;
  billingPeriod: string;
  items: string[];
  isPopular?: boolean;
  sortOrder?: number;
}

interface PlanItemProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: (plan: Plan) => void;
  formatPrice: (price: number, period: string) => string;
}

const PlanItem = ({ plan, isSelected, onSelect, formatPrice }: PlanItemProps) => {
  return (
    <Card
      className={`relative cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:shadow-lg"
      }`}
      onClick={() => onSelect(plan)}
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
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "Terpilih" : "Pilih Plan"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlanItem;