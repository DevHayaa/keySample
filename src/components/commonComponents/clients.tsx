import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    title: "Facility Management",
    image: "/img3.jpg",
    description: "Comprehensive facility management solutions tailored to client needs."
  },
  {
    title: "Cleaning Services",
    image: "/img7.jpg",
    description: "High-quality cleaning services ensuring hygiene and safety."
  },
  {
    title: "Security Services",
    image: "/img9.jpg",
    description: "Reliable security solutions for diverse environments."
  },
  {
    title: "Technical Services",
    image: "/img10.jpg",
    description: "Expert technical support and maintenance services."
  }
];

const Clients = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cover bg-center" style={{ backgroundImage: "url('https://bnr360.com/images/prowin-3.png')" }}>
      {/* Heading and Description */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1A2B5A] mb-4">What We Do</h1>
        <p className="text-lg text-gray-700 max-w-xl mx-auto">We offer a range of services to meet the diverse needs of our clients, ensuring quality and reliability in every project.</p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <Card key={index} className="shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <img src={service.image} alt={service.title} className="w-full h-40 object-cover rounded-t-lg" />
            <CardContent>
              <h2 className="text-xl font-bold mb-2">{service.title}</h2>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clients;
