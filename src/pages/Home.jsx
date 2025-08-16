import React, { useState, useRef } from 'react';

const vehicleTypes = [
  { value: "option-1", label: "Car 3 Seat", src: "images/select-form/car.png" },
  { value: "option-2", label: "Van 7 seat", src: "images/select-form/van.png" },
  { value: "option-3", label: "Traveler 10 Seat", src: "images/select-form/minibus.png" },
  { value: "option-4", label: "Traveler 14 Seat", src: "images/select-form/sportscar.png" },
  { value: "option-5", label: "Traveler 28 Seat", src: "images/select-form/sportscar.png" },
  { value: "option-6", label: "Bus 14 Seat", src: "images/select-form/sportscar.png" },
  { value: "option-7", label: "Bus 19 Seat", src: "images/select-form/sportscar.png" },
  { value: "option-8", label: "Bus 25 Seat", src: "images/select-form/sportscar.png" },
  { value: "option-9", label: "Bus 35 Seat", src: "images/select-form/sportscar.png" },
  { value: "option-10", label: "Bus 49 Seat", src: "images/select-form/sportscar.png" },
];

const dropdownOptions = [
  'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'
];

export default function Home() {
  // Popup states
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showSearchPopup, setShowSearchPopup] = useState(false);

  // Dropdown search states
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSearch, setDropdownSearch] = useState('');
  const [dropdownSelected, setDropdownSelected] = useState('');
  const dropdownRef = useRef(null);

  // Carousel state (for each car, track current index)
  const [carouselIndexes, setCarouselIndexes] = useState(Array(12).fill(0));

  // Helper for time options
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, '0');
    const minute = (i % 2) * 30 === 0 ? '00' : '30';
    return `${hour}:${minute}`;
  });

  // Dropdown search filter
  const filteredDropdownOptions = dropdownOptions.filter(option =>
    option.toLowerCase().includes(dropdownSearch.toLowerCase())
  );

  // Carousel handlers
  const handleCarouselPrev = (carIdx) => {
    setCarouselIndexes(prev => {
      const newIndexes = [...prev];
      newIndexes[carIdx] = (newIndexes[carIdx] + 2) % 3; // 3 images
      return newIndexes;
    });
  };
  const handleCarouselNext = (carIdx) => {
    setCarouselIndexes(prev => {
      const newIndexes = [...prev];
      newIndexes[carIdx] = (newIndexes[carIdx] + 1) % 3;
      return newIndexes;
    });
  };

  // Dropdown click outside handler
  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Hide scroll when popup is open
  React.useEffect(() => {
    if (showFormPopup || showSearchPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showFormPopup, showSearchPopup]);

  // Main render
  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Google Tag Manager */}
      <div dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-WR3SNBLX');`
      }} />
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-WR3SNBLX"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
          title="gtm"
        ></iframe>
      </noscript>

      <div id="wrapper">
        {/* Page Preloader */}
        <div id="de-preloader"></div>

        {/* Header */}
        <header className="shadow-lg bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="flex items-center py-4">
                  <div className="flex-1">
                    {/* Logo */}
                    <div id="logo">
                      <a href="index.html">
                        <img className="h-10" src="images/logo-light.png" alt="Logo" />
                      </a>
                    </div>
                  </div>
                  <div className="flex-1">
                    <ul id="mainmenu" className="flex justify-center space-x-6">
                      <li><a className="text-gray-700 hover:text-blue-600 font-medium" href="index.html">Home</a></li>
                      <li><a className="text-gray-700 hover:text-blue-600 font-medium" href="faq.html">FAQ</a></li>
                      <li><a className="text-gray-700 hover:text-blue-600 font-medium" href="contact.html">Contact us</a></li>
                    </ul>
                    <div className="hidden">
                      <span id="menu-btn"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div id="content">
          <div id="top"></div>
          <section id="section-hero" className="relative">
            <img src="images_02/Untitled.png" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-1/2 text-white">
                  <div className="h-8"></div>
                  <div className="h-8"></div>
                  <h1 className="mb-2 text-4xl font-bold drop-shadow">
                    Looking for a <span className="text-yellow-400">vehicle</span>? You're at the right place.
                  </h1>
                  <div className="h-4"></div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="h-4 sm:hidden"></div>
                  <div className="p-6 rounded-lg shadow-lg bg-gray-800 bg-opacity-80">
                    <form
                      name="contactForm"
                      id="contact_form"
                      method="post"
                      autoComplete="off"
                      onSubmit={e => {
                        e.preventDefault();
                        setShowSearchPopup(true);
                      }}
                    >
                      <div id="step-1" className="flex flex-wrap -mx-2">
                        <div className="w-full lg:w-1/3 px-2 mb-4">
                          <label className="block text-white font-semibold mb-1">Name</label>
                          <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <h5 className="text-white mt-4 font-semibold">Pick Up Location</h5>
                          <input
                            type="text"
                            name="PickupLocation"
                            placeholder="Enter your pickup location"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <h5 className="text-white mt-4 font-semibold">Pick Up Date & Time</h5>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              id="date-picker"
                              name="Pick Up Date"
                              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <select
                              name="Pick Up Time"
                              id="pickup-time"
                              defaultValue="Select time"
                              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option disabled value="Select time">Time</option>
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/3 px-2 mb-4">
                          <label className="block text-white font-semibold mb-1">Phone</label>
                          <input
                            type="text"
                            name="Phone"
                            placeholder="Enter your phone number"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <h5 className="text-white mt-4 font-semibold">Drop Off Location</h5>
                          <input
                            type="text"
                            name="DropoffLocation"
                            placeholder="Enter your dropoff location"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />
                          <h5 className="text-white mt-4 font-semibold">Return Date & Time</h5>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              id="date-picker-2"
                              name="Collection Date"
                              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <select
                              name="Collection Time"
                              id="collection-time"
                              defaultValue="Select time"
                              className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <option disabled value="Select time">Time</option>
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="w-full lg:w-1/3 px-2 mb-4">
                          <label className="block text-white font-semibold mb-1">Vehicle Type</label>
                          <select name="Vehicle Type" id="vehicle_type" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                            {vehicleTypes.map((v) => (
                              <option key={v.value} value={v.value} data-src={v.src}>{v.label}</option>
                            ))}
                          </select>
                          <input
                            type="submit"
                            id="send_message"
                            value="Search Vehicle"
                            className="mt-4 w-full p-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="h-8"></div>
              </div>
            </div>
          </section>

          {/* Search Popup */}
          {showSearchPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg max-w-md w-full mx-auto mt-20 relative shadow-lg">
                <span
                  id="btnCloseForm"
                  className="cursor-pointer text-2xl absolute right-4 top-4 text-gray-500 hover:text-red-500"
                  onClick={() => setShowSearchPopup(false)}
                >X</span>
                <h1 className="text-2xl font-bold mb-2">Search nearest location</h1>
                <p className="mb-4 text-gray-700">For more information. Please complete this form.</p>
                <div className="relative" ref={dropdownRef}>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Search..."
                    value={dropdownSearch}
                    onChange={e => {
                      setDropdownSearch(e.target.value);
                      setDropdownOpen(true);
                    }}
                    onFocus={() => setDropdownOpen(true)}
                  />
                  <div
                    className={`absolute w-full bg-white border border-gray-200 rounded mt-1 shadow-lg z-10 ${dropdownOpen ? 'block' : 'hidden'}`}
                    id="dropdownSelect"
                  >
                    {filteredDropdownOptions.length === 0 && (
                      <div className="p-2 text-gray-400">No results</div>
                    )}
                    {filteredDropdownOptions.map((option, index) => (
                      <div
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        data-value={index + 1}
                        onClick={() => {
                          setDropdownSelected(option);
                          setDropdownSearch(option);
                          setDropdownOpen(false);
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <section id="section-cars" className="pt-16 pb-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap items-center">
                <div className="w-full lg:w-1/2 mx-auto text-center mb-8">
                  <span className="text-lg text-blue-600 font-semibold">Enjoy Your Ride</span>
                  <h2 className="text-3xl font-bold mt-2">Our Vehicle Fleet</h2>
                  <div className="h-5"></div>
                </div>
                {Array(12).fill().map((_, index) => (
                  <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-2 mb-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="relative group">
                        {[1, 2, 3].map((_, i) => (
                          <div
                            key={i}
                            className={`${carouselIndexes[index] === i ? '' : 'hidden'}`}
                          >
                            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                              <img src="images/cars/ferrari-enzo.jpg" alt="" className="object-contain h-full" />
                            </div>
                          </div>
                        ))}
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleCarouselPrev(index)}
                          tabIndex={-1}
                          aria-label="Previous"
                          type="button"
                        >&lt;</button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 bg-opacity-50 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                          onClick={() => handleCarouselNext(index)}
                          tabIndex={-1}
                          aria-label="Next"
                          type="button"
                        >&gt;</button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800">kashinadhan holidays Ramanttukara calicut Road</h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span title="49 seat">
                            <img src="images/icons/1-green.svg" alt="" className="h-6" />
                          </span>
                          <span title="Non Ac">
                            <img src="images/icons/2-green.svg" alt="" className="h-6" />
                          </span>
                          <span title="Push Back">
                            <img src="images/icons/3-green.svg" alt="" className="h-6" />
                          </span>
                          <span title="Charger">
                            <img src="images/icons/4-green.svg" alt="" className="h-6" />
                          </span>
                        </div>
                        <div>
                          <button
                            className="mt-2 w-full p-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                            onClick={() => setShowFormPopup(true)}
                            type="button"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="w-full pt-8 pb-8">
                  <div className="flex justify-center">
                    <a href="#">
                      <img src="images_02/Untitled.png" className="max-w-xs rounded shadow" alt="" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Form Popup */}
        {showFormPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full mx-auto mt-20 relative shadow-lg">
              <span
                id="btnCloseForm"
                className="cursor-pointer text-2xl absolute right-4 top-4 text-gray-500 hover:text-red-500"
                onClick={() => setShowFormPopup(false)}
              >X</span>
              <p className="mb-4 text-gray-700">For enquiry complete the form</p>
              <form
                name="contactForm"
                id="contact_form"
                method="post"
                autoComplete="off"
                onSubmit={e => {
                  e.preventDefault();
                  setShowFormPopup(false);
                }}
              >
                <div id="step-1" className="flex flex-wrap -mx-2">
                  <div className="w-full lg:w-1/2 px-2 mb-4">
                    <label className="block font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block mt-4 font-semibold">Pick Up Location</label>
                    <input
                      type="text"
                      name="PickupLocation"
                      placeholder="Enter your pickup location"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block mt-4 font-semibold">Pick Up Date & Time</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="date-picker"
                        name="Pick Up Date"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <select
                        name="Pick Up Time"
                        id="pickup-time"
                        defaultValue="Select time"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option disabled value="Select time">Time</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 px-2 mb-4">
                    <label className="block font-semibold mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="Phone"
                      placeholder="Enter your phone number"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block mt-4 font-semibold">Drop Off Location</label>
                    <input
                      type="text"
                      name="DropoffLocation"
                      placeholder="Enter your dropoff location"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <label className="block mt-4 font-semibold">Return Date & Time</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="date-picker-2"
                        name="Collection Date"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <select
                        name="Collection Time"
                        id="collection-time"
                        defaultValue="Select time"
                        className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <option disabled value="Select time">Time</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/6 mt-5 px-2">
                    <input
                      type="submit"
                      id="send_message"
                      value="Book Vehicle"
                      className="w-full p-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <a href="#" id="back-to-top" className="fixed bottom-4 right-4 bg-blue-600 text-white p-2 rounded shadow hover:bg-blue-700 transition"></a>

        {/* Footer */}
        <footer className="text-white bg-gray-800 pt-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-1/3 mb-8">
                <div>
                  <h5 className="text-lg font-bold mb-2">About Rentaly</h5>
                  <p className="text-gray-300">
                    Where quality meets affordability. We understand the importance of a smooth and enjoyable
                    journey without the burden of excessive costs. That's why we have meticulously crafted our
                    offerings to provide you with top-notch vehicles at minimum expense.
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/3 mb-8">
                <h5 className="text-lg font-bold mb-2">Info</h5>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-1/2">
                    <ul className="space-y-2 text-gray-300">
                      <li><a href="#" className="hover:text-yellow-400">T&C</a></li>
                      <li><a href="#" className="hover:text-yellow-400">Privacy policy</a></li>
                      <li><a href="#" className="hover:text-yellow-400">FAQ</a></li>
                      <li><a href="#" className="hover:text-yellow-400">Registration</a></li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-1/3 mb-8">
                <div>
                  <h5 className="text-lg font-bold mb-2">Contact Info</h5>
                  <address className="not-italic space-y-2 text-gray-300">
                    <span className="flex items-center"><i className="fa fa-map-marker fa-lg text-yellow-400 mr-2"></i>08 W 36th St, New York, NY 10001</span>
                    <span className="flex items-center"><i className="fa fa-phone fa-lg text-yellow-400 mr-2"></i>+1 333 9296</span>
                    <span className="flex items-center"><i className="fa fa-envelope-o fa-lg text-yellow-400 mr-2"></i><a href="mailto:contact@example.com" className="hover:text-yellow-400">contact@example.com</a></span>
                    <span className="flex items-center"><i className="fa fa-file-pdf-o fa-lg text-yellow-400 mr-2"></i><a href="#" className="hover:text-yellow-400">Download Brochure</a></span>
                  </address>
                  <div className="flex space-x-4 mt-4">
                    <a href="#" className="hover:text-yellow-400"><i className="fa fa-facebook fa-lg"></i></a>
                    <a href="#" className="hover:text-yellow-400"><i className="fa fa-twitter fa-lg"></i></a>
                    <a href="#" className="hover:text-yellow-400"><i className="fa fa-linkedin fa-lg"></i></a>
                    <a href="#" className="hover:text-yellow-400"><i className="fa fa-pinterest fa-lg"></i></a>
                    <a href="#" className="hover:text-yellow-400"><i className="fa fa-rss fa-lg"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 py-4">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap">
                <div className="w-full">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-2 md:mb-0">
                      <a href="index.html" className="text-gray-300 hover:text-yellow-400">Copyright 2024 - Click4Trip.in</a>
                    </div>
                    <ul className="flex space-x-4 text-gray-300">
                      <li><a href="#" className="hover:text-yellow-400">Terms & Conditions</a></li>
                      <li><a href="#" className="hover:text-yellow-400">Privacy Policy</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}