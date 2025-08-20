import { useState } from "react";
import BookingFormSection from "./BookingFormSection";
import VehicleFleet from "./VehicleFleet";

const ParentComponent = () => {
  const [pickupLocation, setPickupLocation] = useState({ lat: null, lng: null });
  const [searchVehicles, setSearchVehicles] = useState([]);

  const handlePickupChange = (coords) => {
    if (coords.lat && coords.lng) {
      setPickupLocation(coords);
    }
  };

  const handleSearchSubmit = (formData) => {
    setSearchVehicles(formData);
    console.log('tesssss',formData);
    
  };

  return (
    <>
      <BookingFormSection
        onSubmit={handleSearchSubmit}
        onPickupChange={handlePickupChange}
      />
      <VehicleFleet
        pickupLat={pickupLocation.lat}
        pickupLng={pickupLocation.lng}
        searchVehicles={searchVehicles}
      />
    </>
  );
};

export default ParentComponent;
