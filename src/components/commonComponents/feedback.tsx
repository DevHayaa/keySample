import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Jessica Devis',
    role: 'CEO @ MARKETING DIGITAL LTD.',
    image: 'https://demos.creative-tim.com/nextjs-tailwind-app-presentation-page/image/avatar1.jpg',
    feedback: "It has been a game-changer for my business. Their dedication, expertise, and attention to detail have truly set them apart. I highly recommend their services!",
  },
  {
    name: 'Mary Joshiash',
    role: 'MARKETING @ APPLE INC.',
    image: 'https://demos.creative-tim.com/nextjs-tailwind-app-presentation-page/image/avatar2.jpg',
    feedback: "It understood my unique needs and delivered a tailored solution promptly. Their customer support is top-notch, and I appreciate their commitment.",
  },
  {
    name: 'Marcell Glock',
    role: 'CFO @ APPLE INC.',
    image: 'https://demos.creative-tim.com/nextjs-tailwind-app-presentation-page/image/avatar3.jpg',
    feedback: "They not only met but exceeded our expectations. Their innovative approach and technical proficiency have been instrumental in our success.",
  },
//   {
//     name: 'Samantha Ray',
//     role: 'CTO @ TECH INNOVATIONS',
//     image: '/user4.jpg',
//     feedback: "Working with them has been seamless. Their solutions are cutting-edge and their team is incredibly responsive.",
//   },
//   {
//     name: 'John Smith',
//     role: 'FOUNDER @ STARTUP HUB',
//     image: '/user5.jpg',
//     feedback: "Their expertise helped us scale quickly and efficiently. We couldn't have done it without them.",
//   },
//   {
//     name: 'Emily Clark',
//     role: 'PRODUCT MANAGER @ DESIGN CO.',
//     image: '/user6.jpg',
//     feedback: "The team was attentive to our needs and delivered beyond expectations. Highly recommended!",
//   },
];

export default function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white relative">
      <div className="text-center mb-10">
        <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">What Clients Say</span>
        <h1 className="text-4xl font-bold text-gray-800 mt-4">Discover What Our Clients Say</h1>
        <p className="text-gray-600 mt-2">We take pride in delivering exceptional results and fostering lasting partnerships.</p>
      </div>

      <div className="relative w-full max-w-4xl">
        <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md">
          <ChevronLeft size={24} />
        </button>

        <div className="flex justify-center items-center">
          <div className="text-center max-w-md">
            <Image
              src={testimonials[current].image}
              alt={testimonials[current].name}
              width={80}
              height={80}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800">{testimonials[current].name}</h3>
            <p className="text-sm text-gray-500">{testimonials[current].role}</p>
            <p className="mt-4 text-gray-600 italic">"{testimonials[current].feedback}"</p>
          </div>
        </div>

        <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow-md">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}