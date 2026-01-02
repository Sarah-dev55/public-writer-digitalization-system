import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "../../../components/ui/card";

export const HowItWorksSection = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: "01",
      title: t('howItWorks.createAccount'),
      description: t('howItWorks.registerBasicInfo'),
    },
    {
      number: "02",
      title: t('howItWorks.bookAppointment'),
      description: t('howItWorks.chooseTimeSlot'),
    },
    {
      number: "03",
      title: t('howItWorks.getConsultation'),
      description: t('howItWorks.meetExperts'),
    },
    {
      number: "04",
      title: t('howItWorks.getExperience'),
      description: t('howItWorks.completeSuccessfully'),
    },
  ];

  // This part shows the steps for using the website
  return (
    <section id="how-it-works" className="w-full bg-app-accent py-12 px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-app-primary">
            {t('common.howItWorks')}
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="h-full rounded-2xl overflow-hidden border-0 shadow-none bg-transparent"
            >
              <CardContent className="flex flex-col items-center gap-6 p-6 sm:p-8 h-full">
                {/* Step Number */}
                <div className="text-xl sm:text-2xl font-bold text-app-primary">
                  {step.number}
                </div>

                {/* Step Content */}
                <div className="flex flex-col gap-3 text-center">
                  <h3 className="text-lg sm:text-xl font-semibold text-app-primary">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-app-primary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};