import React from "react";
import { useTranslation } from "react-i18next";

export const StatsSection = () => {
  const { t } = useTranslation();

  const statsData = [
    {
      value: "20",
      label: t('common.yearsExperience'),
    },
    {
      value: "97%",
      label: t('common.successRate'),
    },
    {
      value: "100",
      label: t('common.clientSatisfaction'),
    },
    {
      value: "24/7h",
      label: t('common.onlineSupport'),
    },
  ];
  return (
    <section className="w-full bg-app-primary py-12 px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => (
            <div key={index} className="flex flex-col items-center gap-4">
              {/* Stat Value */}
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-app-text-light">
                  {stat.value}
                </span>
              </div>

              {/* Stat Label */}
              <p className="text-center text-sm sm:text-base text-app-text-light font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};