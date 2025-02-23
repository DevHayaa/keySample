export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
          {/* Contact Info */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <p>123-456-7890</p>
            <p>info@example.com</p>
          </div>
  
          {/* Social Media Links */}
          <div className="flex space-x-4">
            <a href="#" className="hover:text-pink-500">Facebook</a>
            <a href="#" className="hover:text-pink-500">Twitter</a>
            <a href="#" className="hover:text-pink-500">Instagram</a>
          </div>
  
          {/* Copyright */}
          <div className="text-sm mt-4 md:mt-0">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </footer>
    );
  } 
  