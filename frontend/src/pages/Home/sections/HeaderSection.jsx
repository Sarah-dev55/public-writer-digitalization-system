import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/ui/button";
import { AuthContext } from "../../../context/AuthContext";
import UnifiedHeader from "../../../components/layout/UnifiedHeader";

export const HeaderSection = () => {
  const { t } = useTranslation();
  const { requireAuth, isAuthenticated } = useContext(AuthContext);

  const navItems = [
    { label: t('navigation.home'), active: true, href: "#home" },
    { label: t('navigation.services'), active: false, href: "#about" },
    { label: t('common.clientReviews').replace(':', ''), active: false, href: "#reviews" },
    { label: t('common.howItWorks').replace(':', ''), active: false, href: "#how-it-works" },
  ];

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      window.location.href = "/client/overview";
    } else {
      requireAuth(() => {
        window.location.href = "/client/overview";
      });
    }
  };

  return (
    <header 
      id="home"
      className="w-full bg-cover bg-center flex flex-col relative scroll-smooth"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(52, 78, 65, 0.95) 32%, rgba(0, 0, 0, 0.13) 100%), url('/assets/images/hero_back_image.jpg')`,
      }}
    >
      <UnifiedHeader
        navItems={navItems}
        logoImage="/assets/images/Logo.png"
        logoOnClick={() => handleNavClick("#home")}
        ctaButtonText={isAuthenticated ? t('navigation.dashboard') : t('navigation.login')}
        ctaButtonOnClick={handleCtaClick}
        navClassName="bg-transparent"
        showCtaButton={true}
      />

        {/* Hero Content */}
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 md:py-20 lg:py-24 flex items-center">
          <div className="container mx-auto relative z-10 w-full">
            {/* Left Content */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
              {/* Tagline */}
              <p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-widest text-app-accent px-2 sm:px-0">
                {t('common.appName')}
              </p>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-app-text-light px-2 sm:px-0">
                <span className="text-app-secondary">{t('headings.supportFor')}</span>
                <br />
                <span className="text-app-accent">{t('headings.international')}</span>
                <br />
                <span className="text-app-secondary">{t('headings.procedures')}</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-app-text-muted leading-relaxed max-w-2xl mb-6 sm:mb-8 px-2 sm:px-0">
                {t('headings.heroDescription')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
                <Button onClick={() => requireAuth(() => alert('Open booking flow'))} className="px-5 sm:px-6 py-2 sm:py-2.5 bg-app-primary hover:bg-app-primary/90 rounded-full h-auto text-xs sm:text-sm font-semibold text-app-text-light">
                  {t('appointments.bookAppointment')}
                </Button>
                <Button onClick={() => handleNavClick('#about')} className="px-5 sm:px-6 py-2 sm:py-2.5 bg-app-accent hover:bg-app-accent/90 rounded-full h-auto text-xs sm:text-sm font-semibold text-app-primary">
                  {t('common.next')}
                </Button>
              </div>
            </div>
          </div>
        </div>
    </header>
  );
};