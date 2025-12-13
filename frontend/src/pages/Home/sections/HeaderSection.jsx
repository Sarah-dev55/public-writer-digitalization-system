import React, { useContext } from "react";
import { Button } from "../../../components/ui/button";
import { AuthContext } from "../../../context/AuthContext";
import UnifiedHeader from "../../../components/layout/UnifiedHeader";

const navItems = [
  { label: "Home", active: true, href: "#home" },
  { label: "Our Services", active: false, href: "#about" },
  { label: "Client Reviews", active: false, href: "#reviews" },
  { label: "How It Works", active: false, href: "#how-it-works" },
];

export const HeaderSection = () => {
  const { requireAuth } = useContext(AuthContext);

  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
        ctaButtonText="Dashboard"
        ctaButtonOnClick={() => (window.location.href = "/client/overview")}
        navClassName="bg-transparent"
      />

        {/* Hero Content */}
        <div className="w-full px-6 lg:px-0 py-16 px-4 flex items-center">
          <div className="container mx-auto relative z-10 w-full">
            {/* Left Content */}
            <div className="flex flex-col gap-4">
              {/* Tagline */}
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-app-accent">
                Professional Support For International Procedures
              </p>

              {/* Main Heading */}
              <h3 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-app-text-light">
                <span className="text-app-accent">Professional</span>
                <br />
                <span className="text-app-secondary">Support For</span>
                <br />
                <span className="text-app-accent">International</span>
                <br />
                <span className="text-app-secondary">Procedures</span>
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-app-text-muted leading-relaxed max-w-2xl mb-8">
                Our team of experienced professionals offers dedicated support with all your international administrative procedures, ensuring a smooth and efficient process.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                
                <Button onClick={() => requireAuth(() => (window.location.href = "/client/overview"))} className="px-6 py-2.5 bg-app-primary hover:bg-app-primary/90 rounded-full h-auto text-sm font-semibold text-app-text-light">
                  Book appointment.
                </Button>
                <Button onClick={() => handleNavClick('#about')} className="px-6 py-2.5 bg-app-accent hover:bg-app-accent/90 rounded-full h-auto text-sm font-semibold text-app-primary">
                  Learn more.
                </Button>
              </div>
            </div>
          </div>
        </div>
    </header>
  );
};