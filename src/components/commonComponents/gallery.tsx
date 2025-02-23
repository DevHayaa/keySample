import Image from 'next/image';

const images = [
  '/img1.jpg', '/img2.jpg', '/img3.jpg', '/img4.jpg',
  '/img5.jpg', '/img6.jpg', '/img7.jpg', '/img8.jpg',
  '/img9.jpg', '/img10.jpg'
];

export default function CircularGallery() {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-white">
      {/* Heading and Paragraph */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-[#1A2B5A]">Welcome to <span className="text-[#FF6347]">Key<span className="text-sm align-super">SA</span></span></h1>
        <p className="text-2xl mt-4 text-gray-600">Explore our curated gallery of images presented in a unique circular layout.</p>
      </div>

      {/* Center Logo */}
      <div className="absolute z-10 text-center">
        <h1 className="text-5xl font-bold text-[#1A2B5A]">Key<span className="text-sm align-super">SA</span></h1>
        <p className="text-xl mt-2 text-[#1A2B5A]">GALLERY</p>
      </div>

      {/* Circular Images */}
      <div className="relative w-[500px] h-[500px]">
        {images.map((src, index) => {
          const angle = (index / images.length) * 2 * Math.PI;
          const x = 200 * Math.cos(angle);
          const y = 200 * Math.sin(angle);

          return (
            <div
              key={index}
              className="absolute w-24 h-24 overflow-hidden rounded-md shadow-lg"
              style={{
                top: `calc(50% + ${y}px - 48px)`,
                left: `calc(50% + ${x}px - 48px)`
              }}
            >
              <Image src={src} alt={`Gallery ${index}`} width={96} height={96} className="object-cover w-full h-full" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
