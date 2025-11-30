import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-[#588157]" />,
      title: "Phone",
      info: "+213 XXX XXX XXX",
      description: "Mon-Fri from 9am to 6pm"
    },
    {
      icon: <Mail className="w-6 h-6 text-[#588157]" />,
      title: "Email",
      info: "info@publicwriter.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#588157]" />,
      title: "Office",
      info: "123 Street Name, Algiers",
      description: "Algeria"
    },
    {
      icon: <Clock className="w-6 h-6 text-[#588157]" />,
      title: "Working Hours",
      info: "Monday - Friday",
      description: "9:00 AM - 6:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-[#344E41]">

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(88,129,87,0.15),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto relative text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F3ECDC] mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#588157] to-[#F3ECDC]">Touch</span>
          </h1>
          <p className="text-[#F3ECDC] max-w-3xl mx-auto text-xl">
            Have a question or need our services? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => (
            <div 
              key={index}
              className="bg-[#344E41]/70 backdrop-blur-sm rounded-2xl p-6 border border-[#588157]/50 text-center hover:border-[#588157] transition"
            >
              <div className="bg-[#588157]/30 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#F3ECDC]">
                {item.icon}
              </div>
              <h3 className="text-[#F3ECDC] font-bold mb-2">{item.title}</h3>
              <p className="text-[#F3ECDC] font-semibold mb-1">{item.info}</p>
              <p className="text-[#F3ECDC] text-sm opacity-70">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Left Side - Info */}
          <div>
            <h2 className="text-4xl font-bold text-[#F3ECDC] mb-6">Send Us a Message</h2>
            <p className="text-[#F3ECDC] mb-8 leading-relaxed opacity-70">
              Fill out the form and our team will get back to you within 24 hours. We're committed to providing excellent service and support.
            </p>

            <div className="space-y-6">
              {[
                { icon: <MessageSquare className="w-6 h-6" />, title: "Quick Response", desc: "We respond to all inquiries within 24 hours" },
                { icon: <Phone className="w-6 h-6" />, title: "Call Us Directly", desc: "Prefer to talk? Give us a call during business hours" },
                { icon: <MapPin className="w-6 h-6" />, title: "Visit Our Office", desc: "Come see us in person at our Algiers location" }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="bg-[#588157]/30 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-[#F3ECDC]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[#F3ECDC] font-bold mb-2">{item.title}</h3>
                    <p className="text-[#F3ECDC] text-sm opacity-70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-[#344E41]/70 backdrop-blur-sm rounded-3xl p-8 border border-[#588157]/50">
            <div className="space-y-5">
              {["name","email","phone","subject"].map((field, i) => (
                <div key={i}>
                  <label className="block text-[#F3ECDC] font-semibold mb-2">
                    {field === "name" ? "Full Name" : field.charAt(0).toUpperCase()+field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={field === "email" ? "your.email@example.com" : "Enter here..."}
                    className="w-full bg-[#344E41]/50 border border-[#588157]/50 rounded-xl px-4 py-3 text-[#F3ECDC] placeholder-[#F3ECDC]/50 focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 transition"
                  />
                </div>
              ))}

              {/* Message */}
              <div>
                <label className="block text-[#F3ECDC] font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your needs..."
                  rows="4"
                  className="w-full bg-[#344E41]/50 border border-[#588157]/50 rounded-xl px-4 py-3 text-[#F3ECDC] placeholder-[#F3ECDC]/50 focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 transition resize-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#588157] to-[#F3ECDC] hover:from-[#344E41] hover:to-[#588157] text-[#344E41] font-bold py-3 rounded-xl transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#344E41]/70 backdrop-blur-sm rounded-3xl p-8 border border-[#588157]/50 text-center">
            <MapPin className="w-16 h-16 text-[#588157] mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-[#F3ECDC] mb-4">Visit Our Office</h3>
            <p className="text-[#F3ECDC] mb-2 opacity-70">123 Street Name, Algiers, Algeria</p>
            <p className="text-[#F3ECDC] text-sm opacity-70">Monday - Friday: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </section>
    </div>
  );
}
