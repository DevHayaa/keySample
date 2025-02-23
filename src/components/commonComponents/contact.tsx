import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-6">
      {/* Contact Form */}
      <div className="w-full md:w-1/2 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold mb-4">
          Get in <span className="text-[#1a2b5a]">Touch</span>
        </h1>
        <p className="mb-6 text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu malesuada est.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            rows={4}
            required
          />
          <button type="submit" className="w-full bg-[#1a2b5a] text-white p-3 rounded-lg font-bold hover:bg-gray">
            SEND
          </button>
        </form>
        <div className="flex justify-between mt-6 text-gray-600">
          <div>
            <p className="font-bold">PHONE</p>
            <p>123-456-7890</p>
          </div>
          <div>
            <p className="font-bold">FAX</p>
            <p>123-456-7891</p>
          </div>
          <div>
            <p className="font-bold">EMAIL</p>
            <p>info@example.com</p>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full md:w-1/3 p-4 -mt-10 flex justify-center">
        <iframe
          title="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95565131550497!3d-37.81732774260147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577e1e6e7f4e0!2sMelbourne%20Central!5e0!3m2!1sen!2sau!4v1616484031519!5m2!1sen!2sau"
          width="100%"
          height="350"
          allowFullScreen
          loading="lazy"
          className="rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  );
} 
