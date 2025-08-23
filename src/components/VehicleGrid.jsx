import { useCallback } from "react";
import { useNavigate } from "react-router-dom";



function calculateTotalAmount(vehicle, distanceValue) {

  if (!distanceValue || !vehicle) return null;
  const distanceKm = distanceValue / 1000;
  const minFare =
    Number(vehicle.minimum_fare) >= 0 ? Number(vehicle.minimum_fare) : 0;
  const perKmRate = Number(vehicle.per_kilometer_rate) || 0;
  const fixedKm = Number(vehicle.fixed_km) || 100;

  if (minFare > 0) {
    if (distanceKm <= fixedKm) {
      return minFare;
    } else {
      return minFare + Math.round((distanceKm - fixedKm) * perKmRate);
    }
  } else {
    return Math.round(distanceKm * perKmRate);
  }
}
const PackageCard = ({
  pkg,
  imageIndex,
  onPrevImage,
  onNextImage,
  onBook,
  images,
}) => {
  const navigate=useNavigate()

  return (
    <div className="relative bg-white mb-5 rounded-3xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="absolute top-4 left-0 bg-gradient-to-r from-[#c0404a] to-[#e57373] text-white px-5 py-1 rounded-r-full font-semibold text-xs tracking-widest shadow-md z-10">
        Package Offer
      </div>

      <div className="relative h-36 group">

        {images.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 text-[#c0404a] p-2 rounded-full shadow hover:bg-[#c0404a] hover:text-white transition"
              type="button"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              onClick={onNextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 text-[#c0404a] p-2 rounded-full shadow hover:bg-[#c0404a] hover:text-white transition"
              type="button"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {pkg.head_text && (
          <span className="text-sm uppercase font-semibold text-[#c0404a] tracking-wide mb-1">
            {pkg.head_text}
          </span>
        )}

        <h3 className="font-extrabold text-xl mb-3 text-gray-800 leading-tight">
          {pkg.name}
        </h3>

        {(pkg.from_date || pkg.to_date) && (
          <div className="flex items-center text-sm text-gray-500 mb-2">
            {pkg.from_date && (
              <span className="mr-3 flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" className="stroke-current" />
                  <path d="M16 2v4M8 2v4M3 10h18" className="stroke-current" />
                </svg>
                <span className="font-medium">From:</span> {pkg.from_date}
              </span>
            )}
            {pkg.to_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 2h12M6 22h12M6 2c0 7 6 7 6 10s-6 3-6 10M18 2c0 7-6 7-6 10s6 3 6 10" className="stroke-current" />
                </svg>
                <span className="font-medium">To:</span> {pkg.to_date}
              </span>
            )}
          </div>
        )}

        {(pkg.start_location || pkg.destination) && (
          <div className="text-sm text-gray-500 mb-2">
            {pkg.start_location_text && (
              <p className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="12" rx="3" className="stroke-current" />
                  <circle cx="7.5" cy="17.5" r="1.5" className="stroke-current" />
                  <circle cx="16.5" cy="17.5" r="1.5" className="stroke-current" />
                  <path d="M3 10h18" className="stroke-current" />
                </svg>
                <span className="font-medium">Start:</span>{" "}
                {pkg.start_location_text}
              </p>
            )}
            {pkg.destination_text && (
              <p className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 21c-4.5-5-7-8.5-7-12A7 7 0 0 1 19 9c0 3.5-2.5 7-7 12z" className="stroke-current" />
                  <circle cx="12" cy="9" r="2.5" className="stroke-current" />
                </svg>
                <span className="font-medium">Destination:</span>{" "}
                {pkg.destination_text}
              </p>
            )}
          </div>
        )}

        {pkg.view_points && (
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 20l7-12 4 7 5-9 5 14H3z" className="stroke-current" />
            </svg>
            <span className="font-medium">View Points:</span>{" "}
            {Array.isArray(pkg.view_points)
              ? pkg.view_points.join(", ")
              : pkg.view_points}
          </p>
        )}

        {pkg.price_per_head && (
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-3-3.87M7 21v-2a4 4 0 0 1 3-3.87M12 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" className="stroke-current" />
              <circle cx="12" cy="7" r="4" className="stroke-current" />
            </svg>
            <span className="font-medium">Per Head:</span> ₹{pkg.price_per_head}
          </p>
        )}

        <div className="flex-1" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          {pkg.price && (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#c0404a]">
                ₹{pkg.price}
              </span>
              <span className="text-xs text-gray-500 font-semibold">/package</span>
            </div>
          )}

          <button
          onClick={() => navigate(`/package/${pkg.id}`)}
            className="bg-gradient-to-r from-[#c0404a] to-[#e57373] text-white font-bold py-2 px-6 rounded-full shadow-lg hover:from-[#a8323a] hover:to-[#c0404a] transition-all duration-200 text-base flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 4h16v4a2 2 0 0 1-2 2h-2v4h2a2 2 0 0 1 2 2v4H4v-4a2 2 0 0 1-2-2V4z" className="stroke-current" />
            </svg>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};


const VehicleCard = ({
  vehicle,
  imageIndex,
  onPrevImage,
  onNextImage,
  onBook,
  images,
  distanceValue,
}) => {
  const totalAmount = calculateTotalAmount(vehicle, distanceValue);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800 flex flex-col">
      <div className="relative">
        <img
          src={
            images.length > 0
              ? images[imageIndex]
              : "https://via.placeholder.com/300x200?text=No+Image"
          }
          alt={vehicle.registration_number}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
              type="button"
              tabIndex={0}
            >
              &lt;
            </button>
            <button
              onClick={onNextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-600 focus:outline-none"
              type="button"
              tabIndex={0}
            >
              &gt;
            </button>
          </>
        )}
      </div>
      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h4
          className="font-bold capitalize text-xs mb-1"
          style={{ fontSize: "1.1rem" }}
        >
          {vehicle.registration_number} {vehicle?.type}
        </h4>
        <div className="flex flex-wrap gap-2 my-2">
          {(vehicle.attributes || []).map((attr, idx) => (
            <span
              key={idx}
              className="text-green-500 text-sm flex items-center"
              data-tooltip={attr.label}
            >
              {attr.label}
              {attr.icon_class && (
                <span
                  className={`inline-block ml-1 text-green-500 ${attr.icon_class}`}
                />
              )}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400">
          {vehicle?.location ? (
            vehicle.location
          ) : (
            <span className="text-gray-400">No address available</span>
          )}
        </p>

        <div className="mt-auto flex justify-between items-center">
          {totalAmount !== null && (
            <div className="mt-2 mb-2 h-100">
              <span className="text-lg font-semibold text-[#c0404a]">
                ₹{totalAmount}
              </span>
              <span className="text-xs text-gray-500 ml-1">Approx</span>
            </div>
          )}
  <button
  onClick={() => onBook(vehicle, null)} 
  className="bg-gradient-to-r from-[#c0404a] to-[#e57373] text-white font-bold py-2 px-6 rounded-full ..."
>
  Book Now
</button>
        </div>
      </div>
    </div>
  );
};

const VehicleGrid = ({
  vehicles,
  currentImageIndex,
  setCurrentImageIndex,
  onBook,
  section,
  distanceValue,
  packages = false,
}) => {
  const getVehicleImages = (item) => {
    if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images.map((imgObj) => imgObj.image || imgObj.url || imgObj);
    }
    if (Array.isArray(item.img) && item.img.length > 0) {
      return item.img.map((imgObj) => imgObj.image || imgObj.url || imgObj);
    }
    return [];
  };

  const nextImage = useCallback(
    (id) => {
      const item = vehicles.find((v) => v.id === id);
      const images = getVehicleImages(item);
      if (!item || images.length === 0) return;
      setCurrentImageIndex((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1 >= images.length ? 0 : (prev[id] || 0) + 1,
      }));
    },
    [vehicles, setCurrentImageIndex]
  );

  const prevImage = useCallback(
    (id) => {
      const item = vehicles.find((v) => v.id === id);
      const images = getVehicleImages(item);
      if (!item || images.length === 0) return;
      setCurrentImageIndex((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) - 1 < 0 ? images.length - 1 : (prev[id] || 0) - 1,
      }));
    },
    [vehicles, setCurrentImageIndex]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.isArray(vehicles) && vehicles.length > 0 ? (
        vehicles.map((item) => {
          const images = getVehicleImages(item);
          const imgIndex = currentImageIndex[item.id] || 0;
          if (packages) {
            // Render as package card
            return (
              <PackageCard
                key={item.id}
                pkg={item}
                images={images}
                imageIndex={imgIndex}
                onPrevImage={() => prevImage(item.id)}
                onNextImage={() => nextImage(item.id)}
                onBook={onBook}
              />
            );
          } else {
            // Render as vehicle card
            return (
              <VehicleCard
                key={item.id}
                vehicle={item}
                images={images}
                imageIndex={imgIndex}
                onPrevImage={() => prevImage(item.id)}
                onNextImage={() => nextImage(item.id)}
                onBook={onBook}
                distanceValue={distanceValue}
              />
            );
          }
        })
      ) : (
        <div className="text-center text-gray-400 py-10 col-span-full">
          No vehicles available.
        </div>
      )}
    </div>
  );
};

export default VehicleGrid;
