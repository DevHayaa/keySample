"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import HowWeWork from "@/components/commonComponents/mobile-convenience";
import CircularGallery from "@/components/commonComponents/gallery";
import Clients from "@/components/commonComponents/clients";
import Financials from "@/components/commonComponents/financial";
import FeedbackCard from "@/components/commonComponents/feedback-card";
import TestimonialSlider from "@/components/commonComponents/feedback";
import ContactUs from "@/components/commonComponents/contact";
import Footer from "@/components/commonComponents/footer";


export default function FullScreenSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const overlayText = [
    {
      title: "Expertise",
      description: "Seasoned and independent consultants ensure you receive the best possible guidance."
    },
    {
      title: "Innovation",
      description: "We embrace groundbreaking solutions with a holistic approach that covers every aspect of your facilities’ operation."
    },
    {
      title: "Adaptability",
      description: "We remain agile, constantly evolving to meet your changing needs."
    }
  ];

  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden">
      <Slider {...settings}>
        {overlayText.map((text, index) => (
          <div key={index} className="relative w-screen h-screen">
            <img 
              src={
                index === 0 ? "https://keyfm.sa/wp-content/uploads/al_opt_content/IMAGE/keyfm.sa/wp-content/uploads/slider/cache/e7c23165a28a2faefd30674abedb2dcd/Prince-Mohammed-Bin-Salman-Nonprofit-City-1536x1056-1.jpg" :
                index === 1 ? "https://keyfm.sa/wp-content/uploads/al_opt_content/IMAGE/keyfm.sa/wp-content/uploads/slider/cache/b10e08809b6ba8a1e0902cd7a4a0a4c7/Background-1.jpg" :
                "https://keyfm.sa/wp-content/uploads/al_opt_content/IMAGE/keyfm.sa/wp-content/uploads/slider/cache/c004a5d5961a0dc09c2a23a1994e6f04/Banner-4-1.jpg"
              }
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-6">
              <h2 className="text-4xl font-bold mb-4">{text.title}</h2>
              <p className="text-lg max-w-xl">{text.description}</p>
            </div>
          </div>
        ))}
      </Slider>


      <HowWeWork />


      <Clients />

      <CircularGallery />

      <Financials />
 
 <TestimonialSlider />

 <ContactUs />

 <Footer />


    </div>
  );
}
