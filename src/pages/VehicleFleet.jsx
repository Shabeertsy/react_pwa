import { useState, useEffect } from "react";
import axios from "axios";
import BookingPopup from "./BookingPopup";
import { baseUrl } from "../Constants";
import Loader from "../components/Loader";
import VehicleGrid from "../components/VehicleGrid";

const VehicleFleet = ({ searchVehicles }) => {
  const [vehicles, setVehicles] = useState({ popular: [], normal: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [bookingVehicle, setBookingVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [location, setLocation] = useState({ lat: null, lng: null });

  // Obtain geolocation only if searchVehicles prop is empty or has no valid data
  useEffect(() => {
    if (searchVehicles && (Array.isArray(searchVehicles.popular_vehicles) || Array.isArray(searchVehicles.vehicles))) {
      // Data present from prop, do not override with geolocation
      return;
    }

    if (!("geolocation" in navigator)) {
      setLocation({ lat: null, lng: null });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => setLocation({ lat: null, lng: null })
    );
  }, [searchVehicles]);

  useEffect(() => {
    if (searchVehicles && (Array.isArray(searchVehicles.popular_vehicles) || Array.isArray(searchVehicles.vehicles))) {
      setVehicles({
        popular: Array.isArray(searchVehicles.popular_vehicles) ? searchVehicles.popular_vehicles : [],
        normal: Array.isArray(searchVehicles.vehicles) ? searchVehicles.vehicles : [],
      });
      setLoading(false);
      setFetchError(null);
      return;
    }

    const fetchVehicles = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        if (location.lat === null || location.lng === null) {
          setVehicles({ popular: [], normal: [] });
          setLoading(false);
          return;
        }

        const { data } = await axios.get(`${baseUrl}api/list-owner-vehicles/`, {
          params: { lat: location.lat, lng: location.lng },
        });

        setVehicles({
          popular: Array.isArray(data?.popular_vehicles) ? data.popular_vehicles : [],
          normal: Array.isArray(data?.vehicles) ? data.vehicles : [],
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setFetchError("Failed to fetch vehicles.");
        setVehicles({ popular: [], normal: [] });
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchVehicles, location.lat, location.lng]);

  const openPopup = (vehicle) => {
    setBookingVehicle(vehicle);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setBookingVehicle(null);
  };

  return (
    <section className="py-16 text-white bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-[#c0404a] text-lg font-semibold">Enjoy Your Ride</span>
          <h2 className="text-4xl font-bold text-dark mt-2 text-gray-800">Our Vehicle Fleet</h2>
        </div>
        {loading ? (
          <Loader />
        ) : fetchError ? (
          <div className="text-center text-red-500 py-10">{fetchError}</div>
        ) : (
          <>
            {vehicles.popular.length > 0 && (
              <div className="mb-12">
                <h5 className="text-xl text-dark font-bold mb-5 text-center text-gray-800">Popular Vehicles</h5>
                <VehicleGrid
                  vehicles={vehicles.popular}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  onBook={openPopup}
                  section="popular"
                />
              </div>
            )}
            {vehicles.normal.length > 0 && (
              <div>
                <h5 className="text-lg text-dark font-bold mb-4 text-center text-gray-800">Vehicles</h5>
                <VehicleGrid
                  vehicles={vehicles.normal}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  onBook={openPopup}
                  section="normal"
                />
              </div>
            )}
            {vehicles.popular.length === 0 && vehicles.normal.length === 0 && (
              <div className="text-center py-10 text-gray-700">No vehicles available</div>
            )}
          </>
        )}
      </div>
      {showPopup && <BookingPopup onClose={closePopup} vehicle={bookingVehicle} />}
    </section>
  );
};

export default VehicleFleet;
