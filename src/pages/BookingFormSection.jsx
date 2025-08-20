import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import axios from "axios";
import { baseUrl } from "../Constants";

const BookingFormSection = ({ onSubmit, onPickupChange }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    pickup: "",
    dropoff: "",
    pickupDate: today,
    pickupTime: "",
    returnDate: today,
    returnTime: "",
    vehicleType: "",
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState(null);

  const [pickupSuggestions, setPickupSuggestions] = useState({ results: [], more: false, page: 1, query: "" });
  const [dropoffSuggestions, setDropoffSuggestions] = useState({ results: [], more: false, page: 1, query: "" });
  const [pickupCoords, setPickupCoords] = useState({ lat: null, lng: null });
  const [dropoffCoords, setDropoffCoords] = useState({ lat: null, lng: null });

  const [searchResults, setSearchResults] = useState([]);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setLoadingTypes(true);
      setTypesError(null);
      try {
        const response = await axios.get(`${baseUrl}api/list-vehicle-types/`);
        let types = response.data;
        if (Array.isArray(types)) {
          const normalizedTypes = types.map((type) => {
            if (typeof type === "string") {
              return { id: type, label: type, seat_capacity: "-", type_name: type, icon: null };
            }
            return {
              id: type.id ?? type.vehicle_type ?? JSON.stringify(type),
              label: type.label ?? type.vehicle_type ?? "Unknown",
              seat_capacity: type.seat_capacity ?? "-",
              type_name: type.type_name ?? type.label ?? type.vehicle_type ?? "Unknown",
              icon: type.icon ?? null,
            };
          });
          setVehicleTypes(normalizedTypes);
        }
      } catch {
        setTypesError("Failed to load vehicle types");
        setVehicleTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchVehicleTypes();
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchLocationSuggestions = async (query, forField, page = 1) => {
    if (!query || query.length < 3) {
      if (forField === "pickup") setPickupSuggestions({ results: [], more: false, page: 1, query: "" });
      else setDropoffSuggestions({ results: [], more: false, page: 1, query: "" });
      return;
    }
    try {
      const response = await axios.get(`${baseUrl}api/locations/search/`, { params: { q: query, page } });
      const data = response.data;
      const suggestions = Array.isArray(data.results) ? data.results : [];
      const more = data.pagination && data.pagination.more;
      if (forField === "pickup") {
        setPickupSuggestions(prev => ({
          results: page === 1 ? suggestions : [...prev.results, ...suggestions],
          more: !!more, page, query
        }));
      } else {
        setDropoffSuggestions(prev => ({
          results: page === 1 ? suggestions : [...prev.results, ...suggestions],
          more: !!more, page, query
        }));
      }
    } catch {
      if (forField === "pickup") setPickupSuggestions({ results: [], more: false, page: 1, query: "" });
      else setDropoffSuggestions({ results: [], more: false, page: 1, query: "" });
    }
  };

  const debouncedFetchPickup = useRef(debounce(fetchLocationSuggestions, 300)).current;
  const debouncedFetchDropoff = useRef(debounce(fetchLocationSuggestions, 300)).current;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "pickup") {
      debouncedFetchPickup(value, "pickup", 1);
      setPickupCoords({ lat: null, lng: null });
      setPickupSuggestions({ results: [], more: false, page: 1, query: value });
    }
    if (name === "dropoff") {
      debouncedFetchDropoff(value, "dropoff", 1);
      setDropoffCoords({ lat: null, lng: null });
      setDropoffSuggestions({ results: [], more: false, page: 1, query: value });
    }
  };

  const handleSubmit = async (e) => {
    console.log(pickupCoords,'corddsss');
    
    e.preventDefault();
    const params = {
      lat: pickupCoords.lat ?? null,
      lng: pickupCoords.lng ?? null,
      type: form.vehicleType || null,
    };

    try {
      const response = await axios.get(`${baseUrl}api/list-owner-vehicles/`, {
        params,
      });
      setSearchResults(response.data);
      if (typeof onSubmit === "function") {
        onSubmit(response.data);
      }
    } catch (error) {
      console.error("Search API error:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setPickupSuggestions(prev => ({ ...prev, results: [] }));
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target)) {
        setDropoffSuggestions(prev => ({ ...prev, results: [] }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/list-banner-images/`);
        const urls = Array.isArray(response.data) ? response.data.map(item => item.url) : [];
        setImageUrls(urls);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchData();
  }, []);

  const generateTimeOptions = () =>
    [...Array(24)].map((_, i) => {
      const time = `${String(i).padStart(2, "0")}:00`;
      return <option key={i} value={time}>{time}</option>;
    });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  return (
    <section className="relative w-screen md:h-[70vh] lg:h-[70vh] overflow-hidden">
      <Slider {...sliderSettings} className="w-screen md:h-[70vh] lg:h-[70vh]">
        {imageUrls.map((url, i) => (
          <div key={i} className="w-screen min-h-screen md:h-[70vh] lg:h-[70vh]">
            <img
              src={url}
              alt={`slide-${i}`}
              className="w-full w-screen min-h-screen md:h-[70vh] lg:h-[70vh]"
              loading="lazy"
            />
          </div>
        ))}
      </Slider>

      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Booking Form */}
      <div className="absolute inset-0 flex items-center justify-center z-10 mt-10 px-4">
        <div className="container max-w-5xl w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-[#767676]/90 rounded px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-end shadow-lg"
            autoComplete="off"
          >
            {/* Column 1 */}
            <div>
              <div className="relative" ref={pickupRef}>
                <label className="text-white block font-medium">Pick Up Location</label>
                <input
                  name="pickup"
                  placeholder="Enter your pickup location"
                  value={form.pickup}
                  onChange={handleChange}
                  className="bg-white px-2 py-2 w-full outline-none rounded"
                  autoComplete="off"
                  required
                />
                {pickupSuggestions.results.length > 0 && (
                  <ul className="bg-white border border-gray-300 max-h-48 overflow-auto mt-1 rounded shadow-md absolute z-50 w-full">
                    {pickupSuggestions.results.map((item) => (
                      <li
                        key={item.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer rounded"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, pickup: item.city }));
                          setPickupCoords({ lat: item.lat, lng: item.lng });
                          setPickupSuggestions((prev) => ({ ...prev, results: [] }));
                          if (typeof onPickupChange === "function") {
                            onPickupChange({ lat: item.latitude, lng: item.longitude });
                          }
                        }}
                      >
                        <span className="font-semibold">{item.city}</span>
                        {item.district && <span className="text-gray-500 text-xs ml-1">{item.district}</span>}
                        {item.state && <span className="text-gray-400 text-xs ml-1">{item.state}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="text-white block font-medium mt-4">Return Date & Time</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="returnDate"
                  min={form.pickupDate}
                  className="bg-white border-r border-gray-300 px-2 py-2 w-2/3 outline-none rounded-l"
                  value={form.returnDate}
                  onChange={handleChange}
                />
                <select
                  name="returnTime"
                  className="bg-white px-2 py-2 w-1/3 outline-none rounded-r"
                  value={form.returnTime}
                  onChange={handleChange}
                >
                  <option value="">Time</option>
                  {generateTimeOptions()}
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="relative" ref={dropoffRef}>
                <label className="text-white block font-medium">Drop Off Location</label>
                <input
                  name="dropoff"
                  placeholder="Enter your dropoff location"
                  value={form.dropoff}
                  onChange={handleChange}
                  className="bg-white px-2 py-2 w-full outline-none rounded"
                  autoComplete="off"
                />
                {dropoffSuggestions.results.length > 0 && (
                  <ul className="bg-white border border-gray-300 max-h-48 overflow-auto mt-1 rounded shadow-md absolute z-50 w-full">
                    {dropoffSuggestions.results.map((item) => (
                      <li
                        key={item.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer rounded"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, dropoff: item.city }));
                          setDropoffCoords({ lat: item.latitude, lng: item.longitude });
                          setDropoffSuggestions(prev => ({ ...prev, results: [] }));
                        }}
                      >
                        <span className="font-semibold">{item.city}</span>
                        {item.district && <span className="text-gray-500 text-xs ml-1">{item.district}</span>}
                        {item.state && <span className="text-gray-400 text-xs ml-1">{item.state}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="text-white block font-medium mt-4">Pick Up Date & Time</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="pickupDate"
                  min={today}
                  className="bg-white border-r border-gray-300 px-2 py-2 w-2/3 outline-none rounded-l"
                  value={form.pickupDate}
                  onChange={handleChange}
                />
                <select
                  name="pickupTime"
                  className="bg-white px-2 py-2 w-1/3 outline-none rounded-r"
                  value={form.pickupTime}
                  onChange={handleChange}
                >
                  <option value="">Time</option>
                  {generateTimeOptions()}
                </select>
              </div>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col justify-start h-full">
              <div>
                <label className="text-white block font-medium">Vehicle Type</label>
                <div className="relative">
                  <select
                    name="vehicleType"
                    className="appearance-none bg-white px-2 py-2 w-full outline-none text-base shadow-md border border-gray-300 focus:ring-2 focus:ring-[#c0404a] focus:border-[#c0404a] rounded transition"
                    value={form.vehicleType}
                    onChange={handleChange}
                    disabled={loadingTypes || !!typesError}
                  >
                    <option value="">
                      {loadingTypes
                        ? "Loading vehicle types..."
                        : typesError
                        ? "Failed to load types"
                        : "Select vehicle type"}
                    </option>
                    {vehicleTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.type_name} {type.seat_capacity ? `(${type.seat_capacity} seats)` : ""}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
                    ▼
                  </span>
                </div>
              </div>

              <div className="flex justify-center items-start mt-4 md:mt-2">
                <button
                  type="submit"
                  className="bg-[#c0404a] px-8 py-3 text-white font-semibold text-lg shadow rounded w-full md:w-auto"
                  style={{ letterSpacing: ".5px" }}
                >
                  Search Vehicle
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingFormSection;
