import React from "react";
import { Card, CardContent } from "../../../components/ui/card";

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Register with your basic information",
  },
  {
    number: "02",
    title: "Book Appointment",
    description: "Choose a convenient time slot",
  },
  {
    number: "03",
    title: "Get Consultation",
    description: "Meet with our experts",
  },
  {
    number: "04",
    title: "Get Experience",
    description: "Complete your procedure successfully",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="w-full bg-app-accent py-10 px-3 sm:py-16 md:py-20 lg:py-24">
      <div className="">
        {/* Header */}
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl py-10 sm:text-3xl md:text-4xl lg:text-5xl font-bold text-app-primary">
            Steps How It Works:
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