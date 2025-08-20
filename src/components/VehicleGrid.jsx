import { useCallback } from "react";

const VehicleCard = ({
  vehicle,
  imageIndex,
  onPrevImage,
  onNextImage,
  onBook,
  images,
}) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden text-gray-800 flex flex-col">
    {/* Image Section */}
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
      <div className="mt-auto flex justify-end">
        <button
          onClick={onBook}
          className="bg-[#c0404a] text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition"
          type="button"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
);

const VehicleGrid = ({
  vehicles,
  currentImageIndex,
  setCurrentImageIndex,
  onBook,
  section,
}) => {
  const getVehicleImages = (vehicle) => {
    if (Array.isArray(vehicle.images) && vehicle.images.length > 0) {
      return vehicle.images.map((imgObj) => imgObj.image || imgObj.url || imgObj);
    }
    if (Array.isArray(vehicle.img) && vehicle.img.length > 0) {
      return vehicle.img.map((imgObj) => imgObj.image || imgObj.url || imgObj);
    }
    return [];
  };

  const nextImage = useCallback(
    (id) => {
      const vehicle = vehicles.find((v) => v.id === id);
      const images = getVehicleImages(vehicle);
      if (!vehicle || images.length === 0) return;
      setCurrentImageIndex((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1 >= images.length ? 0 : (prev[id] || 0) + 1,
      }));
    },
    [vehicles, setCurrentImageIndex]
  );

  const prevImage = useCallback(
    (id) => {
      const vehicle = vehicles.find((v) => v.id === id);
      const images = getVehicleImages(vehicle);
      if (!vehicle || images.length === 0) return;
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
        vehicles.map((vehicle) => {
          const images = getVehicleImages(vehicle);
          const imgIndex = currentImageIndex[vehicle.id] || 0;
          return (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              images={images}
              imageIndex={imgIndex}
              onPrevImage={() => prevImage(vehicle.id)}
              onNextImage={() => nextImage(vehicle.id)}
              onBook={() => onBook(vehicle)}
            />
          );
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
