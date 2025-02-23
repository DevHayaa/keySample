import React from 'react';

const HowWeWork = () => {
  return (
    <section className="py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="bg-[#0d203e] text-white text-xs px-10 py-1 rounded-full tracking-wider">ABOUT US</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">HOW WE WORK</h2>
        <p className="text-lg leading-relaxed">
          Our approach involves collaborative planning, meticulous execution, and continuous evaluation to ensure optimal outcomes for every project.
        </p>
        <div className="relative mt-12 flex justify-center">
          <div className="absolute -left-6 -top-6 bg-green-500 w-16 h-16 rounded-lg"></div>
          <div className="absolute -right-6 -bottom-6 bg-yellow-400 w-16 h-16 rounded-lg"></div>
          <div className="relative">
            <img
              src="https://keyfm.sa/wp-content/uploads/al_opt_content/IMAGE/keyfm.sa/wp-content/uploads/slider/cache/c004a5d5961a0dc09c2a23a1994e6f04/Banner-4-1.jpg"
              alt="City View"
              className="rounded-lg w-full"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white bg-opacity-75 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-black"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M6.5 5.5v9l7-4.5-7-4.5z" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowWeWork; 