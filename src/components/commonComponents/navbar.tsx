"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { title: "About Us", href: "/mobile-convenience" },
  { title: "Clients", href: "/clients" },
  { title: "Sectors", href: "/sectors" },
  { title: "Certifications", href: "/certifications" },
  { title: "Financials", href: "/financial" },
  { title: "Gallery", href: "/gallery" },
  { title: "Customer Feedback", href: "/feedback" },
  { title: "Contact", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Split links into two groups: 4 on the left, 4 on the right.
  const leftLinks = links.slice(0, 4);
  const rightLinks = links.slice(4, 8);

  return (
    <nav className="bg-white shadow-md bg-[#0d203e]">
      {/* Desktop Navbar */}
      <div className="container mx-auto flex items-center justify-center py-4 px-4">
        {/* Left links (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          {leftLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <span className="text-white hover:text-gray-600 transition-colors duration-200 font-medium">
                {link.title}
              </span>
            </Link>
          ))}
        </div>
        {/* Center logo with minimal horizontal margin */}
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-12 mx-2" />
        </Link>
        {/* Right links (desktop only) */}
        <div className="hidden md:flex items-center space-x-4">
          {rightLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <span className="text-white hover:text-gray-600 transition-colors duration-200 font-medium">
                {link.title}
              </span>
            </Link>
          ))}
        </div>
        {/* Mobile: Hamburger menu button */}
        <div className="md:hidden flex items-center ml-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gray-600 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {links.map((link) => (
              <Link key={link.title} href={link.href}>
                <div className="py-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
                  {link.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
