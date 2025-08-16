import { useState, useEffect } from "react";
import axios from "axios";
import BookingPopup from "./BookingPopup";
import { baseUrl } from "../Constants";

const VehicleFleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocation({ lat: null, lng: null });
        }
      );
    } else {
      setLocation({ lat: null, lng: null });
    }
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const params = {};
        if (location.lat !== null && location.lng !== null) {
          params.lat = location.lat;
          params.lng = location.lng;
        }
        const response = await axios.get(`${baseUrl}api/list-owner-vehicles/`, { params });
        let data = response.data;
        if (!Array.isArray(data)) {
          data = [];
        }
        setVehicles(data);
      } catch (error) {
        setFetchError("Failed to fetch vehicles.");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    if (location.lat !== undefined && location.lng !== undefined) {
      fetchVehicles();
    }
  }, [location.lat, location.lng]);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  const getVehicleImages = (vehicle) => {
    if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images.map((imgObj) => imgObj.image || imgObj.url || imgObj);
    }
    if (Array.isArray(vehicle.img) && vehicle.img.length > 0) {
      return vehicle.img.map((imgObj) => imgObj.image || imgObj.url || imgObj);
    }
    return [];
  };

  const nextImage = (id) => {
    const vehicle = vehicles.find((v) => v.id === id);
    const images = getVehicleImages(vehicle);
    if (!vehicle || images.length === 0) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1 >= images.length ? 0 : (prev[id] || 0) + 1,
    }));
  };

  const prevImage = (id) => {
    const vehicle = vehicles.find((v) => v.id === id);
    const images = getVehicleImages(vehicle);
    if (!vehicle || images.length === 0) return;
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) - 1 < 0 ? images.length - 1 : (prev[id] || 0) - 1,
    }));
  };

  return (
    <section className="py-16  text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-[#c0404a] text-lg font-semibold">Enjoy Your Ride</span>
          <h2 className="text-4xl font-bold text-dark mt-2">Our Vehicle Fleet</h2>
        </div>
        {loading ? (
          <div className="text-center text-gray-300 py-10">Loading vehicles...</div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-10">{fetchError}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles.map((vehicle) => {
                const images = getVehicleImages(vehicle);
                const imgIndex = currentImageIndex[vehicle.id] || 0;
                return (
                  <div key={vehicle.id} className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800">
                    <div className="relative">
                      <div className="carousel">
                        <div className="item">
                          <div className="imageContainer">
                            <img
                              src={
                                images.length > 0
                                  ? images[imgIndex]
                                  : "https://via.placeholder.com/300x200?text=No+Image"
                              }
                              alt={vehicle.registration_number}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={() => prevImage(vehicle.id)}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
                          >
                            &lt;
                          </button>
                          <button
                            onClick={() => nextImage(vehicle.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600"
                          >
                            &gt;
                          </button>
                        </>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-capitalize text-xs" style={{ fontSize: "1rem" }}>{vehicle.registration_number} {vehicle?.type}</h4>
                      <div className="flex justify-content-between align-items-center ">
                        <div className="flex space-x-2 mt-2 ">
                          {(vehicle.attributes || []).map((attr, index) => (
                            <span key={index} className="d-atr text-green-500 text-sm" data-tooltip={attr.label}>
                              {attr.label}
                              {attr.icon_class && (
                                <span className={`inline-block align-middle ml-1 text-green-500 ${attr.icon_class}`}></span>
                              )}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={openPopup}
                            className="btn-main  bg-[#c0404a] text-white font-semibold py-2 px-4  hover:bg-red-700 transition duration-300"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-10">No vehicles available.</div>
            )}
          </div>
        )}
      </div>
      {showPopup && <BookingPopup onClose={closePopup} />}
    </section>
  );
};

export default VehicleFleet;