import React from "react";

const Footer = () => {
  return (
    <footer className="text-white bg-black py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
          {/* About */}
          <div className="flex-1 mb-8 md:mb-0">
            <h5 className="font-bold mb-3">About Rentaly</h5>
            <p className="text-gray-300">
              Where quality meets affordability. We understand the importance of a smooth and enjoyable
              journey without the burden of excessive costs. That's why we have meticulously crafted our
              offerings to provide you with top-notch vehicles at minimum expense.
            </p>
          </div>
          {/* Info */}
          <div className="flex-1 mb-8 md:mb-0">
            <h5 className="font-bold mx-4  mb-3">Info</h5>
            <ul className="list-none space-y-2">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  T&amp;C
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  Registration
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div className="flex-1">
            <h5 className="font-bold mb-3">Contact Info</h5>
            <address className="not-italic text-gray-300 flex flex-col gap-2">
              <span className="flex items-center">
                <i className="id-color fa fa-map-marker fa-lg mr-2 text-[#c0404a]"></i>
                08 W 36th St, New York, NY 10001
              </span>
              <span className="flex items-center">
                <i className="id-color fa fa-phone fa-lg mr-2 text-[#c0404a]"></i>
                +1 333 9296
              </span>
              <span className="flex items-center">
                <i className="id-color fa fa-envelope-o fa-lg mr-2 text-[#c0404a]"></i>
                <a
                  href="mailto:contact@example.com"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  contact@example.com
                </a>
              </span>
              <span className="flex items-center">
                <i className="id-color fa fa-file-pdf-o fa-lg mr-2 text-[#c0404a]"></i>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  Download Brochure
                </a>
              </span>
            </address>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-[#c0404a] no-underline transition"
                style={{ textDecoration: "none" }}
                aria-label="Facebook"
              >
                <i className="fa fa-facebook fa-lg"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-[#c0404a] no-underline transition"
                style={{ textDecoration: "none" }}
                aria-label="Twitter"
              >
                <i className="fa fa-twitter fa-lg"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-[#c0404a] no-underline transition"
                style={{ textDecoration: "none" }}
                aria-label="LinkedIn"
              >
                <i className="fa fa-linkedin fa-lg"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-[#c0404a] no-underline transition"
                style={{ textDecoration: "none" }}
                aria-label="Pinterest"
              >
                <i className="fa fa-pinterest fa-lg"></i>
              </a>
              <a
                href="#"
                className="text-white hover:text-[#c0404a] no-underline transition"
                style={{ textDecoration: "none" }}
                aria-label="RSS"
              >
                <i className="fa fa-rss fa-lg"></i>
              </a>
            </div>
          </div>
        </div>
        {/* Subfooter */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              <a
                href="#"
                className="text-white no-underline"
                style={{ textDecoration: "none" }}
              >
                Copyright 2024 - Click4Trip.in
              </a>
            </div>
            <ul className="flex space-x-6 list-none">
              <li>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
                >
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-[#c0404a] no-underline transition"
                  style={{ textDecoration: "none" }}
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