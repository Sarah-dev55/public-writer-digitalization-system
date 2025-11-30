import React from 'react';
import { BookOpen, PenTool, Users, ArrowRight, Star, Quote } from 'lucide-react';

export default function Home() {
  const services = [
    {
      icon: <PenTool className="w-8 h-8" />,
      title: "Professional Writing",
      description: "Expert writing services for all your documentation needs"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Legal Documents",
      description: "Precise legal documentation and contract writing"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Personal Services",
      description: "Letters, applications, and personal correspondence"
    }
  ];

  const testimonials = [
    {
      text: "Exceptional service and attention to detail. My documents were perfect!",
      author: "Ahmed M.",
      rating: 5
    },
    {
      text: "Professional, fast, and reliable. Highly recommended for anyone.",
      author: "Fatima K.",
      rating: 5
    },
    {
      text: "The best public writer I've worked with. Outstanding quality.",
      rating: 5
    }
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#344E41", // Main background
      }}
    >

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(88,129,87,0.15),transparent_60%)]"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center">

            {/* Badge */}
            <div
              className="inline-block mb-4 px-4 py-2 rounded-full border"
              style={{
                backgroundColor: "#588157",
                borderColor: "rgba(255,255,255,0.25)"
              }}
            >
              <span className="text-white text-sm font-semibold">
                Professional Writing Services
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Words,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-200 to-green-400">
                Professionally Written
              </span>
            </h1>

            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Expert public writing services for legal documents, applications, letters, and all your official documentation needs.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="text-white px-8 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105 flex items-center justify-center space-x-2"
                style={{ backgroundColor: "#588157" }}
              >
                <span>Start Writing</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                className="px-8 py-4 rounded-lg text-lg font-semibold border text-white"
                style={{
                  backgroundColor: "rgba(0,0,0,0.25)",
                  borderColor: "#588157"
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4" style={{ backgroundColor: "#3A5A40" }}>
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Services
            </h2>
            <p className="text-green-200 text-lg">
              Professional writing solutions tailored to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="backdrop-blur-sm p-8 rounded-2xl border transition transform hover:-translate-y-2"
                style={{
                  backgroundColor: "rgba(52, 78, 65, 0.6)",
                  borderColor: "#588157"
                }}
              >
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 text-white"
                  style={{ backgroundColor: "#588157" }}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-green-100 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="backdrop-blur-sm rounded-3xl p-12 border"
            style={{
              background: "linear-gradient(90deg, #344E41AA, #588157AA)",
              borderColor: "#588157"
            }}
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              {[500, 350, 10].map((value, i) => (
                <div key={i}>
                  <div className="text-5xl font-bold text-green-200 mb-2">
                    {value}+
                  </div>
                  <div className="text-green-100 text-lg">
                    {i === 0 && "Documents Written"}
                    {i === 1 && "Happy Clients"}
                    {i === 2 && "Years Experience"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4" style={{ backgroundColor: "#3A5A40" }}>
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What Clients Say
            </h2>
            <p className="text-green-200 text-lg">
              Trusted by hundreds of satisfied clients
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="backdrop-blur-sm p-8 rounded-2xl border"
                style={{
                  backgroundColor: "rgba(52, 78, 65, 0.7)",
                  borderColor: "#588157"
                }}
              >
                <Quote className="w-10 h-10 text-green-300 mb-4" />
                <p className="text-green-100 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">
                    {testimonial.author}
                  </span>
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5"
                        style={{ color: "#ffc107", fill: "#ffc107" }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
