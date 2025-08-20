import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* About Section */}
          <div>
            <h5 className="font-bold mb-4 text-lg">About Rentaly</h5>
            <p className="text-gray-300 text-sm leading-relaxed">
              Where quality meets affordability. We understand the importance of a smooth and enjoyable
              journey without the burden of excessive costs. That's why we have meticulously crafted our
              offerings to provide you with top-notch vehicles at minimum expense.
            </p>
          </div>
          {/* Info Section */}
          <div>
            <h5 className="font-bold mb-4 text-lg">Info</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  T&amp;C
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  Registration
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Section */}
          <div>
            <h5 className="font-bold mb-4 text-lg">Contact Info</h5>
            <address className="not-italic text-gray-300 text-sm flex flex-col gap-2">
              <div className="flex items-center">
                <i className="fa fa-map-marker fa-lg mr-2 text-[#c0404a]" aria-hidden="true"></i>
                08 W 36th St, New York, NY 10001
              </div>
              <div className="flex items-center">
                <i className="fa fa-phone fa-lg mr-2 text-[#c0404a]" aria-hidden="true"></i>
                +1 333 9296
              </div>
              <div className="flex items-center">
                <i className="fa fa-envelope-o fa-lg mr-2 text-[#c0404a]" aria-hidden="true"></i>
                <a
                  href="mailto:contact@example.com"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  contact@example.com
                </a>
              </div>
              <div className="flex items-center">
                <i className="fa fa-file-pdf-o fa-lg mr-2 text-[#c0404a]" aria-hidden="true"></i>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  Download Brochure
                </a>
              </div>
            </address>
            {/* Social Icons */}
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#"
                className="hover:text-[#c0404a] transition-colors"
                aria-label="Facebook"
              >
                <i className="fa fa-facebook fa-lg"></i>
              </a>
              <a
                href="#"
                className="hover:text-[#c0404a] transition-colors"
                aria-label="Twitter"
              >
                <i className="fa fa-twitter fa-lg"></i>
              </a>
              <a
                href="#"
                className="hover:text-[#c0404a] transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fa fa-linkedin fa-lg"></i>
              </a>
              <a
                href="#"
                className="hover:text-[#c0404a] transition-colors"
                aria-label="Pinterest"
              >
                <i className="fa fa-pinterest fa-lg"></i>
              </a>
              <a
                href="#"
                className="hover:text-[#c0404a] transition-colors"
                aria-label="RSS"
              >
                <i className="fa fa-rss fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Subfooter */}
        <div className="border-t border-gray-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="text-center md:text-left text-sm">
              <span>
                &copy; 2024 - <a href="#" className="hover:text-[#c0404a] transition-colors">Click4Trip.in</a>
              </span>
            </div>
            <ul className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[#c0404a] transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;