import { useState, useEffect, useRef } from "react";
import axios from "axios";
import BookingPopup from "./BookingPopup";
import { baseUrl } from "../Constants";
import Loader from "../components/Loader";
import VehicleGrid from "../components/VehicleGrid";

const VehicleFleet = ({ searchVehicles, distanceValue, distanceText, form,pickupLat,pickupLng,dropLoc }) => {
  const [vehicles, setVehicles] = useState({ popular: [], normal: [] });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [bookingVehicle, setBookingVehicle] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [packages, setPackages] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (
      searchVehicles &&
      (Array.isArray(searchVehicles.popular_vehicles) ||
        Array.isArray(searchVehicles.vehicles))
    ) {
      return;
    }
    if (!("geolocation" in navigator)) {
      setLocation({ lat: null, lng: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setLocation({ lat: null, lng: null })
    );
  }, [searchVehicles]);

  // Fetch vehicles from API with pagination
  const fetchVehicles = async (pageToLoad = 1) => {
    console.log('vehicleworking',location);

    setLoading(true);
    setFetchError(null);

    try {
      if (location.lat === null || location.lng === null) {
        setVehicles({ popular: [], normal: [] });
        setLoading(false);
        setHasMore(false);
        return;
      }

      const { data } = await axios.get(`${baseUrl}api/list-owner-vehicles/`, {
        params: { lat: location.lat, lng: location.lng, page: pageToLoad, page_size: 10 },
      });

      const popularNew =
        Array.isArray(data.popular_vehicles) ? data.popular_vehicles : [];
      const normalNew = Array.isArray(data.vehicles) ? data.vehicles : [];

      setVehicles((prev) => ({
        popular: pageToLoad === 1 ? popularNew : [...prev.popular, ...popularNew],
        normal: pageToLoad === 1 ? normalNew : [...prev.normal, ...normalNew],
      }));
      setHasMore(data.has_more);
      setLoading(false);
    } catch (err) {
      setFetchError("Failed to fetch vehicles.");
      setLoading(false);
      setHasMore(false);
    }
  };



    // Fetch packages from API with pagination
    const fetchPackages = async (pageToLoad = 1) => {
      console.log('working',location);
      
      setLoading(true);
      setFetchError(null);

      try {
          // if (location.lat === null && pickupLat || location.lng === null && pickupLng == null) {
          //   setPackages([]);
          //   setLoading(false);
          //   setHasMore(false);
          //   return;
          // }
        const { data } = await axios.get(`${baseUrl}api/list-packages/`, {
          params: { lat: pickupLat ? pickupLat : location.lat, lng:pickupLng ?pickupLng : location.lng, page: pageToLoad, page_size: 10,
            dest_lat:dropLoc?.lat ,dest_lng:dropLoc?.lng
           },
        });

        const packagesNew = Array.isArray(data.packages) ? data.packages : [];

        setPackages((prev) =>
          pageToLoad === 1 ? packagesNew : [...prev, ...packagesNew]
        );
        setHasMore(data.has_more);
        setLoading(false);
      } catch (err) {
        setFetchError("Failed to fetch packages.");
        setLoading(false);
        setHasMore(false);
      }
    };



  useEffect(() => {
    setPage(1);
    if (
      searchVehicles &&
      (Array.isArray(searchVehicles.popular_vehicles) ||
        Array.isArray(searchVehicles.vehicles))
    ) {
      setVehicles({
        popular: Array.isArray(searchVehicles.popular_vehicles)
          ? searchVehicles.popular_vehicles
          : [],
        normal: Array.isArray(searchVehicles.vehicles) ? searchVehicles.vehicles : [],
      });
      setLoading(false);
      setHasMore(false);
    } else {
      fetchVehicles(1);
    }
  
  }, [searchVehicles, location.lat, location.lng]);


useEffect(()=>{
  fetchPackages(1);

},[pickupLng,pickupLat,searchVehicles,location.lat, location.lng,dropLoc.lat,dropLoc.lng])


  // Infinite scroll handler
  const handleScroll = () => {
    if (
      !loading &&
      hasMore &&
      containerRef.current &&
      window.innerHeight + window.scrollY >=
        containerRef.current.offsetTop + containerRef.current.offsetHeight - 300
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Listen for scroll to load more
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // Fetch next page when page state updates > 1
  useEffect(() => {
    if (page === 1) return;
    fetchVehicles(page);
  }, [page]);

  const openPopup = (vehicle) => {
    setBookingVehicle(vehicle);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setBookingVehicle(null);
  };



  return (
    <section className="py-16 text-white bg-gray-50" ref={containerRef}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-[#c0404a] text-lg font-semibold">Enjoy Your Ride</span>
          <h2 className="text-4xl font-bold text-dark mt-2 text-gray-800">Our Vehicle Fleet</h2>
        </div>
        {loading && page === 1 ? (
          <Loader />
        ) : fetchError ? (
          <div className="text-center text-red-500 py-10">{fetchError}</div>
        ) : (
          <>
          {packages.length > 0 && (
              <div>
                <h5 className="text-lg text-dark font-bold mb-4 text-center text-gray-800">
                  Packages
                </h5>
                <VehicleGrid
                  vehicles={packages}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  onBook={openPopup}
                  section="normal"
                  distanceValue={distanceValue}
                  packages={true}

                />
              </div>
            )}
            {vehicles.popular.length > 0 && (
              <div className="mb-12">
                <h5 className="text-xl text-dark font-bold mb-5 text-center text-gray-800">
                  Popular Vehicles
                </h5>
                <VehicleGrid
                  vehicles={vehicles.popular}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  onBook={openPopup}
                  section="popular"
                  distanceValue={distanceValue}
                />
              </div>
            )}
            {vehicles.normal.length > 0 && (
              <div>
                <h5 className="text-lg text-dark font-bold mb-4 text-center text-gray-800">
                  Vehicles
                </h5>
                <VehicleGrid
                  vehicles={vehicles.normal}
                  currentImageIndex={currentImageIndex}
                  setCurrentImageIndex={setCurrentImageIndex}
                  onBook={openPopup}
                  section="normal"
                  distanceValue={distanceValue}

                />
              </div>
            )}
            {vehicles.popular.length === 0 && vehicles.normal.length === 0 && (
              <div className="text-center py-10 text-gray-700">No vehicles available</div>
            )}
            {loading && page > 1 && (
              <div className="text-center mt-4">
                <Loader />
              </div>
            )}
          </>
        )}
      </div>
      {showPopup && bookingVehicle && (
        <BookingPopup
          onClose={closePopup}
          vehicle={bookingVehicle}
          distanceText={distanceText}
          distanceValue={distanceValue}
          filledData={form}
        />
      )}
    </section>
  );
};

export default VehicleFleet;
