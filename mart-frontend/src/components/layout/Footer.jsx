import React from "react";
import { FaStore } from "react-icons/fa";

const Footer = ({ siteSettings }) => {
  return (
    <footer className="bg-indigo-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2">{siteSettings.site_name}</h3>
            <p className="text-indigo-200">{siteSettings.tagline}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
            <p className="text-indigo-200">Email: {siteSettings.contact_email}</p>
            <p className="text-indigo-200">Phone: {siteSettings.contact_phone}</p>
            <p>{siteSettings.address}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
            <div className="flex space-x-4">
              {siteSettings.social_links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition duration-300">
                  <FaStore size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; {new Date().getFullYear()} {siteSettings.site_name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;