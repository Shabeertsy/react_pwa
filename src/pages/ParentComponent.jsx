import { useState } from "react";
import BookingFormSection from "./BookingFormSection";
import VehicleFleet from "./VehicleFleet";

const ParentComponent = () => {
  const [pickupLocation, setPickupLocation] = useState({ lat: null, lng: null });
  const [searchVehicles, setSearchVehicles] = useState([]);
  const [distanceText, setDistanceText] = useState(""); 
  const [distanceValue, setDistanceValue] = useState(null);

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



  console.log(distanceText,distanceValue,'distance');

  const handlePickupChange = (coords) => {
    if (coords.lat && coords.lng) {
      setPickupLocation(coords);
    }
  };

  const handleSearchSubmit = (formData) => {
    setSearchVehicles(formData);
    console.log('tesssss',formData);

    console.log(form,'formmmm');
    
    
  };

  return (
    <>
      <BookingFormSection
        onSubmit={handleSearchSubmit}
        onPickupChange={handlePickupChange}
        setDistanceText={setDistanceText}
        setDistanceValue={setDistanceValue}
        form={form}
        setForm={setForm}
      />
      <VehicleFleet
        pickupLat={pickupLocation.lat}
        pickupLng={pickupLocation.lng}
        searchVehicles={searchVehicles}
        distanceText={distanceText}
        distanceValue={distanceValue}
        form={form}

      />
    </>
  );
};

export default ParentComponent;
