import { ArrowRightIcon } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";

export const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-app-accent py-8 px-6 sm:py-12 md:py-16">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-app-primary">
          {t('common.clientReviews')}
        </h2>

        <Button
          variant="link"
          className="flex items-center gap-2 p-0 h-auto hover:no-underline whitespace-nowrap"
        >
          <span className="text-sm sm:text-base font-semibold text-app-primary">
            {t('common.viewAllReviews')}
          </span>
          <ArrowRightIcon className="w-5 h-5 text-app-primary flex-shrink-0" />
        </Button>
      </div>
    </section>
  );
};