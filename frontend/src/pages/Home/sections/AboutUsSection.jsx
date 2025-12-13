import {
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  GraduationCapIcon,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

const servicesData = [
  {
    icon: CalendarDaysIcon,
    title: "Work Permits",
    items: [
      "Study visa application",
      "Scholarship application",
      "University admissions",
      "Interview preparation",
    ],
  },
  {
    icon: GraduationCapIcon,
    title: "Student Procedures",
    items: [
      "Study visa application",
      "Scholarship application",
      "University admissions",
      "Interview preparation",
    ],
  },
  {
    icon: BriefcaseIcon,
    title: "Interview Preparation",
    items: [
      "Interview coaching",
      "Form with 50+ questions",
      "Mock interviews",
    ],
  },
];

export const AboutUsSection = () => {
  const navigate = useNavigate();

  return (
    <section id="about" className="w-full bg-app-accent py-12 px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-app-primary">
            Our Services:
          </h2>

          <Button
            variant="ghost"
            onClick={() => navigate("/services")}
            className="flex items-center gap-2 hover:bg-transparent p-0 whitespace-nowrap"
          >
            <span className="text-sm sm:text-base font-semibold text-app-primary">
              View all services
            </span>
            <ArrowRightIcon className="w-5 h-5 text-app-primary flex-shrink-0" />
          </Button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {servicesData.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="h-full bg-app-primary border-none rounded-2xl overflow-hidden"
              >
                <CardContent className="flex flex-col items-center gap-6 p-6 sm:p-8 h-full">
                  {/* Icon */}
                  <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-app-text-light" />

                  {/* Content */}
                  <div className="flex flex-col gap-4 w-full">
                    <h3 className="text-lg sm:text-xl font-semibold text-app-text-light text-center">
                      {service.title}
                    </h3>

                    {/* Items List */}
                    <div className="flex flex-col gap-3">
                      {service.items.map((item, itemIndex) => (
                        <p
                          key={itemIndex}
                          className="text-center text-sm sm:text-base text-app-text-muted leading-relaxed"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};