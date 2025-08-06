"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  Calendar,
  MessageSquare,
  Sparkles,
  Play,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations('hero');
  const tCommon = useTranslations('common');
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      {/* <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" /> */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-8 px-4 py-2 text-xs shadow-2xl font-medium bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-transparent dark:text-fuchsia-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('badgeText')}
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-8">
            {/* <span className="block">Meet</span> */}
            <span className="block bg-gradient-to-r from-yellow-600 to-pink-600 dark:from-yellow-300 dark:to-pink-300 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-12 dark:text-gray-100 leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Feature Cards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 max-w-7xl mx-auto">
            <Card className="flex-1 min-w-[250px] shadow-xl border-0 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-200 group-hover:scale-110 transition-all duration-300">
                  <Bot className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                  {t('features.aiChatbot.title')}
                </span>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  {t('features.aiChatbot.description')}
                </p>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[250px] shadow-xl border-0 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-orange-200 group-hover:scale-110 transition-all duration-300">
                  <Calendar className="w-6 h-6 text-orange-600 group-hover:text-orange-700" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors duration-300">
                  {t('features.smartScheduling.title')}
                </span>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  {t('features.smartScheduling.description')}
                </p>
              </CardContent>
            </Card>
            <Card className="flex-1 min-w-[250px] shadow-xl border-0 bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out cursor-pointer group">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-purple-200 group-hover:scale-110 transition-all duration-300">
                  <MessageSquare className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
                </div>
                <span className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300">
                  {t('features.whatsappIntegration.title')}
                </span>
                <p className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  {t('features.whatsappIntegration.description')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="font-semibold hover:shadow-xl transition-all duration-300"
            >
              {t('cta.getStartedFree')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                {t('socialProof.rating')}
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('socialProof.trusted')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
