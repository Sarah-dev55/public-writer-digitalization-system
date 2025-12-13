import {
  ChevronRightIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import React from "react";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_ADDRESS } from "../../constants/contact";

const quickLinks = [
  { text: "Home", href: "#home" },
  { text: "Our Services", href: "#about" },
  { text: "Client Reviews", href: "#reviews" },
  { text: "How It Works", href: "#how-it-works" },
];

const contactInfo = [
  { icon: MapPinIcon, text: CONTACT_ADDRESS },
  { icon: MailIcon, text: CONTACT_EMAIL },
  { icon: PhoneIcon, text: CONTACT_PHONE },
];

export const FooterSection = () => {
  const handleNavClick = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-app-primary py-12 px-6 sm:py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12 sm:mb-16">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <img
              className="w-32 h-auto object-contain"
              alt="Company Logo"
              src="/assets/images/Logo.png"
            />

            <div className="flex flex-col gap-4">
              <p className="text-sm sm:text-base text-app-text-muted leading-relaxed">
                Professional administrative support for international procedures
                and visa applications.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-lg sm:text-xl font-semibold text-app-accent">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3">
                  <ChevronRightIcon className="w-5 h-5 text-app-accent flex-shrink-0" />
                  <a
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="text-sm sm:text-base text-app-text-muted hover:text-app-accent transition-colors cursor-pointer"
                  >
                    {link.text}
                  </a>
                </div>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg sm:text-xl font-semibold text-app-accent">
              Contact Us
            </h3>

            <address className="flex flex-col gap-4 not-italic">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <item.icon className="w-5 h-5 text-app-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-app-text-muted">
                    {item.text}
                  </span>
                </div>
              ))}
            </address>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-app-text-muted/30" />

        {/* Copyright */}
        <div className="pt-8 sm:pt-12">
          <p className="text-center text-xs sm:text-sm text-app-accent">
            &copy; {new Date().getFullYear()} Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;