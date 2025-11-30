import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, Eye, Users, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
export default function AboutUs() {
  const values = [
    { icon: <Award className="w-8 h-8 text-[#588157]" />, title: "Excellence", description: "We maintain the highest standards in every document we create" },
    { icon: <CheckCircle className="w-8 h-8 text-[#588157]" />, title: "Accuracy", description: "Precision and attention to detail in all our work" },
    { icon: <Users className="w-8 h-8 text-[#588157]" />, title: "Client Focus", description: "Your satisfaction is our top priority" }
  ];
  const team = [
    { name: "Mohamed Benali", role: "Founder & Senior Writer", experience: "15 years experience" },
    { name: "Fatima Zahra", role: "Legal Document Specialist", experience: "10 years experience" },
    { name: "Karim Mansouri", role: "Administrative Writing Expert", experience: "12 years experience" }
  ];
  return (
    <div className="min-h-screen bg-[#344E41]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(88,129,87,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F3ECDC] mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#588157] to-[#F3ECDC]">Public Writer</span>
          </h1>
          <p className="text-xl text-[#F3ECDC] max-w-3xl mx-auto">
            Your trusted partner in professional document writing for over a decade
          </p>
        </div>
      </section>
      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#344E41]/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#588157]/50">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F3ECDC] mb-6">Our Story</h2>
            <div className="space-y-4 text-[#F3ECDC]/80 leading-relaxed">
              <p>
                Founded in 2014, Public Writer began with a simple mission: to provide accessible, professional writing services to everyone in our community. What started as a small office has grown into a trusted name in document preparation and professional writing.
              </p>
              <p>
                Over the years, we've helped hundreds of clients with their legal documents, applications, letters, and various administrative needs. Our commitment to quality and client satisfaction has made us the go-to choice for professional writing services in Algiers.
              </p>
              <p>
                Today, we continue to uphold our founding principles while embracing modern technology to serve you better. Our experienced team is dedicated to ensuring every document meets the highest standards of accuracy and professionalism.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {[ 
            { icon: <Target className="w-8 h-8 text-[#588157]" />, title: "Our Mission", desc: "To provide accessible, accurate, and professional writing services that empower individuals and businesses to communicate effectively and achieve their goals with confidence." },
            { icon: <Eye className="w-8 h-8 text-[#588157]" />, title: "Our Vision", desc: "To be the leading provider of professional writing services in Algeria, recognized for our excellence, integrity, and commitment to helping our clients succeed in all their documentation needs." }
          ].map((item, i) => (
            <div key={i} className="bg-[#344E41]/70 backdrop-blur-sm rounded-3xl p-8 border border-[#588157]/50">
              <div className="bg-[#588157]/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-3xl font-bold text-[#F3ECDC] mb-4">{item.title}</h3>
              <p className="text-[#F3ECDC]/80 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F3ECDC] mb-4">Our Values</h2>
            <p className="text-[#F3ECDC]/80 text-lg">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-[#344E41]/50 backdrop-blur-sm p-8 rounded-2xl border border-[#588157]/50 hover:border-[#588157] transition transform hover:-translate-y-2">
                <div className="bg-[#588157]/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-[#F3ECDC] mb-4">{value.title}</h3>
                <p className="text-[#F3ECDC]/80 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Team Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F3ECDC] mb-4">Meet Our Team</h2>
            <p className="text-[#F3ECDC]/80 text-lg">Experienced professionals dedicated to your success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-[#344E41]/70 backdrop-blur-sm rounded-2xl p-8 border border-[#588157]/50 text-center">
                <div className="w-24 h-24 bg-[#588157]/30 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-12 h-12 text-[#F3ECDC]" />
                </div>
                <h3 className="text-xl font-bold text-[#F3ECDC] mb-2">{member.name}</h3>
                <p className="text-[#F3ECDC]/80 mb-2">{member.role}</p>
                <p className="text-[#F3ECDC]/60 text-sm">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#344E41]/70 backdrop-blur-sm rounded-3xl p-12 border border-[#588157]/50">
            <h2 className="text-4xl md:text-5xl font-bold text-[#F3ECDC] mb-6">
              Ready to Work With Us?
            </h2>
            <p className="text-[#F3ECDC]/80 text-xl mb-8">
              Contact us today and experience professional writing services
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center space-x-2 bg-[#588157] hover:bg-[#344E41] text-[#F3ECDC] px-10 py-4 rounded-lg text-lg font-semibold transition transform hover:scale-105"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
