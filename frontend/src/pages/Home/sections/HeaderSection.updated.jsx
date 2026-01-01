import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { AuthContext } from "../../../context/AuthContext";
import UnifiedHeader from "../../../components/layout/UnifiedHeader";
import LanguageSwitcher from "../../../components/common/LanguageSwitcher";

export const HeaderSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { requireAuth, isAuthenticated, logout } = useContext(AuthContext);

  const navItems = [
    { label: t('navigation.home'), active: true, href: "#home" },
    { label: t('navigation.services'), active: false, href: "#about" },
    { label: t('common.appName'), active: false, href: "#reviews" },
    { label: "How It Works", active: false, href: "#how-it-works" },
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
      navigate("/login");
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
        rightComponent={<LanguageSwitcher />}
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
                <span className="text-app-accent">{t('navigation.services')}</span>
                <br />
                <span className="text-app-secondary">Support For</span>
                <br />
                <span className="text-app-accent">International</span>
                <br />
                <span className="text-app-secondary">Procedures</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg text-app-text-muted leading-relaxed max-w-2xl mb-6 sm:mb-8 px-2 sm:px-0">
                Our team of experienced professionals offers dedicated support with all your international administrative procedures, ensuring a smooth and efficient process.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 px-2 sm:px-0">
                <Button 
                  onClick={() => requireAuth(() => alert('Open booking flow'))} 
                  className="px-5 sm:px-6 py-2 sm:py-2.5 bg-app-primary hover:bg-app-primary/90 rounded-full h-auto text-xs sm:text-sm font-semibold text-app-text-light"
                >
                  {t('common.submit')}
                </Button>
                
                {/* Auth Links */}
                {!isAuthenticated && (
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <Button 
                      onClick={() => navigate("/login")}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 bg-app-secondary/80 hover:bg-app-secondary rounded-full h-auto text-xs sm:text-sm font-semibold text-app-text-light"
                    >
                      {t('navigation.login')}
                    </Button>
                    <Button 
                      onClick={() => navigate("/signup")}
                      className="px-5 sm:px-6 py-2 sm:py-2.5 bg-app-accent/80 hover:bg-app-accent rounded-full h-auto text-xs sm:text-sm font-semibold text-app-text-light"
                    >
                      {t('navigation.signup')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </header>
  );
};
