import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Financials() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollAmount = 0;
    const slide = () => {
      if (sliderRef.current) {
        scrollAmount += 1;
        if (scrollAmount >= sliderRef.current.scrollWidth / 2) {
          scrollAmount = 0;
        }
        sliderRef.current.scrollLeft = scrollAmount;
      }
    };
    const interval = setInterval(slide, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-cover bg-center relative" style={{ backgroundImage: 'url(https://keyfm.sa/wp-content/uploads/2024/05/Group-2193-2.jpg)' }}>
      {/* Heading Section */}
      <div className="text-center mb-10">
        <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold">OUR CLIENTS</span>
        <h1 className="text-5xl font-bold text-white mt-4">TRUSTED BY THE BEST</h1>
      </div>

      {/* Logo Slider */}
      <div className="w-full overflow-hidden">
        <div className="flex space-x-16 items-center animate-scroll justify-between" ref={sliderRef}>
          {['logo1.png', 'logo2.png', 'logo3.png', 'logo1.png', 'logo2.png', 'logo3.png'].map((logo, idx) => (
            <div key={idx} className="flex-shrink-0">
              <Image src={`/${logo}`} alt={`Logo ${idx + 1}`} width={150} height={100} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          width: calc(200%);
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
