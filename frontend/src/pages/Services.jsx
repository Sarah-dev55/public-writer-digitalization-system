import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  Users2Icon,
  BookOpenIcon,
  AwardIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import Footer from '../components/layout/Footer';

const servicesData = [
  {
    icon: GraduationCapIcon,
    title: 'International Study Procedure',
    description: 'Procédure Démarche Etude International',
    details: [
      'Complete documentation preparation',
      'University selection guidance',
      'Application letter writing',
      'Document authentication and notarization',
      'Visa documentation support',
      'Interview preparation for studies',
    ],
  },
  {
    icon: BookOpenIcon,
    title: 'Study Visa',
    description: 'Visa d\'Étude',
    details: [
      'Campus France (France)',
      'Canadian study permit',
      'Schengen study visa',
      'Visa application guidance',
      'Health insurance arrangement',
      'Accommodation support',
    ],
  },
  {
    icon: Users2Icon,
    title: 'Family Regrouping',
    description: 'Regroupement Familial',
    details: [
      'Family reunification documentation',
      'Relationship proof compilation',
      'Financial capacity demonstration',
      'Housing requirement verification',
      'Application submission assistance',
      'Government consultation support',
    ],
  },
  {
    icon: BriefcaseIcon,
    title: 'Work Visa',
    description: 'Visa de Travail',
    details: [
      'Work permit application',
      'Employment contract verification',
      'Salary documentation preparation',
      'Professional qualification assessment',
      'Work visa interview coaching',
      'Contract review and negotiation',
    ],
  },
  {
    icon: AwardIcon,
    title: 'USA Lottery Visa',
    description: 'Loterie USA (Diversity Visa)',
    details: [
      'Eligibility verification',
      'Application form completion (DV-260)',
      'Document preparation and organization',
      'Interview preparation and coaching',
      'Medical examination guidance',
      'Police clearance assistance',
    ],
  },
  {
    icon: CheckCircle2Icon,
    title: 'Interview Preparation',
    description: 'Préparation Entretiens',
    details: [
      'Mock interview sessions',
      'Common questions practice',
      'Answer strategy development',
      'Professional presentation coaching',
      'Document organization',
      'Confidence building exercises',
    ],
  },
];

const completePackage = {
  icon: CheckCircle2Icon,
  title: 'Complete Dream Realization Package',
  description: 'Procédure Complète pour un Rêve Réaliser',
  details: [
    'Comprehensive consultation and assessment',
    'Personalized migration/relocation plan',
    'All documentation preparation and review',
    'Multiple visa applications (if needed)',
    'Interview coaching and preparation',
    'Post-arrival support and guidance',
    'Accommodation assistance',
    'Job search and placement support',
    'Integration assistance in new country',
    'Continuous follow-up and support',
  ],
};

export default function Services() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <main className="flex-1">
        {/* Back Button Card */}
        
      
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-app-primary to-app-primary/90 py-16 px-6 sm:py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <Card className="w-fit bg-app-text-light border-none rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 hover:bg-app-text-light/90 transition-colors duration-200"
                  aria-label="Go back"
                >
                  <ArrowLeftIcon className="w-6 h-6 sm:w-7 sm:h-7 text-app-primary" />
                </button>
              </CardContent>
            </Card>
          </div>
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-app-text-light">
                Our Services
              </h1>
              <p className="text-lg sm:text-xl text-app-text-muted max-w-2xl mx-auto">
                Comprehensive solutions for your immigration, education, and career dreams
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full bg-app-accent py-12 px-6 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {servicesData.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={index}
                    className="h-full bg-app-primary border-none rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    <CardContent className="flex flex-col items-start gap-6 p-6 sm:p-8 h-full">
                      {/* Icon */}
                      <IconComponent className="w-12 h-12 sm:w-14 sm:h-14 text-app-accent flex-shrink-0" />

                      {/* Content */}
                      <div className="flex flex-col gap-4 w-full">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-app-text-light">
                            {service.title}
                          </h3>
                          <p className="text-sm sm:text-base text-app-text-muted italic mt-1">
                            {service.description}
                          </p>
                        </div>

                        {/* Items List */}
                        <div className="flex flex-col gap-2">
                          {service.details.map((detail, detailIndex) => (
                            <div
                              key={detailIndex}
                              className="flex gap-3 items-start"
                            >
                              <ArrowRightIcon className="w-4 h-4 text-app-accent flex-shrink-0 mt-1" />
                              <p className="text-sm sm:text-base text-app-text-muted leading-relaxed">
                                {detail}
                              </p>
                            </div>
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

        {/* Complete Package Section */}
        <section className="w-full bg-gradient-to-r from-app-primary to-app-primary/95 py-12 px-6 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <Card className="h-full bg-app-accent border-none rounded-2xl overflow-hidden shadow-xl">
              <CardContent className="flex flex-col gap-8 p-8 sm:p-10 md:p-12">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="bg-app-primary/20 p-4 rounded-full">
                    <completePackage.icon className="w-16 h-16 text-app-primary" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4 text-center">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-app-primary">
                    {completePackage.title}
                  </h2>
                  <p className="text-base sm:text-lg text-app-primary/80 italic">
                    {completePackage.description}
                  </p>
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {completePackage.details.map((detail, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-start bg-app-primary/5 p-4 rounded-lg"
                    >
                      <CheckCircle2Icon className="w-5 h-5 text-app-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm sm:text-base text-app-primary leading-relaxed">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    className="bg-app-primary text-app-text-light hover:bg-app-primary/90 px-8 py-3 text-base sm:text-lg font-semibold"
                  >
                    Get Started Today
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Info Section */}
        <section className="w-full bg-app-accent py-12 px-6 sm:py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="bg-app-primary/5 rounded-2xl p-8 sm:p-12 border border-app-primary/10">
              <h3 className="text-xl sm:text-2xl font-bold text-app-primary mb-4">
                Why Choose Us?
              </h3>
              <ul className="space-y-4 text-app-primary/80">
                <li className="flex gap-3">
                  <span className="text-app-primary font-bold">•</span>
                  <span>Expert guidance with years of experience in immigration and education</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-app-primary font-bold">•</span>
                  <span>Personalized approach tailored to your specific needs and goals</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-app-primary font-bold">•</span>
                  <span>Complete documentation support from start to finish</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-app-primary font-bold">•</span>
                  <span>Regular follow-up and continuous support throughout your journey</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-app-primary font-bold">•</span>
                  <span>Transparent communication and realistic expectations</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
