import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../Constants";

const BookingFormSection = ({ onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
    pickupDate: today,
    pickupTime: "",
    returnDate: today,
    returnTime: "",
    vehicleType: "",
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState(null);

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
              return { 
                id: type, 
                label: type, 
                seat_capacity: "-", 
                type_name: type, 
                icon: null 
              };
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
      } catch (err) {
        setTypesError("Failed to load vehicle types");
        setVehicleTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const generateTimeOptions = () =>
    [...Array(24)].map((_, i) => {
      const time = `${String(i).padStart(2, "0")}:00`;
      return (
        <option key={i} value={time}>
          {time}
        </option>
      );
    });

  return (
    <section className="flex justify-center py-10 mt-25">
      <div className="container max-w-5xl w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-[#767676] bg-opacity-80 rounded px-8 py-6 grid grid-cols-3 gap-6 w-full items-end"
          style={{ boxShadow: "0 4px 10px 0 rgba(0,0,0,0.1)" }}
        >
          {/* Column 1 */}
          <div>
            <label className="text-white mb-1 block font-medium">Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="bg-white px-2 py-1 w-full outline-none"
              required
            />

            <label className="text-white block font-medium mt-4">Pick Up Location</label>
            <input
              name="pickup"
              placeholder="Enter your pickup location"
              value={form.pickup}
              onChange={handleChange}
              className="bg-white px-2 py-1 w-full outline-none"
              required
            />

            <label className="text-white block font-medium mt-4">Return Date & Time</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="returnDate"
                min={form.pickupDate}
                className="bg-white border-r border-gray-300 px-2 py-1 w-2/3 outline-none"
                value={form.returnDate}
                onChange={handleChange}
                required
              />
              <select
                name="returnTime"
                className="bg-white px-2 py-1 w-1/3 outline-none"
                value={form.returnTime}
                onChange={handleChange}
                required
              >
                <option value="">Time</option>
                {generateTimeOptions()}
              </select>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <label className="text-white block font-medium">Phone</label>
            <input
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              className="bg-white px-2 py-1 w-full outline-none"
              required
            />

            <label className="text-white block font-medium mt-4">Drop Off Location</label>
            <input
              name="dropoff"
              placeholder="Enter your dropoff location"
              value={form.dropoff}
              onChange={handleChange}
              className="bg-white px-2 py-1 w-full outline-none"
              required
            />

            <label className="text-white block font-medium mt-4">Pick Up Date & Time</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="pickupDate"
                min={today}
                className="bg-white border-r border-gray-300 px-2 py-1 w-2/3 outline-none"
                value={form.pickupDate}
                onChange={handleChange}
                required
              />
              <select
                name="pickupTime"
                className="bg-white px-2 py-1 w-1/3 outline-none"
                value={form.pickupTime}
                onChange={handleChange}
                required
              >
                <option value="">Time</option>
                {generateTimeOptions()}
              </select>
            </div>
          </div>

          {/* Column 3: Vehicle Type + Submit */}
          <div className="flex flex-col justify-start h-full">
            <div>
              <label className="text-white block font-medium mt-2">Vehicle Type</label>
              <select
                name="vehicleType"
                className="bg-white px-2 py-3 w-full outline-none"
                style={{ minHeight: "48px", fontSize: "1.1rem" }}
                value={form.vehicleType}
                onChange={handleChange}
                disabled={loadingTypes || !!typesError}
                required
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
            </div>
            <div className="flex justify-center items-start mt-2">
              <button
                type="submit"
                className="bg-[#c0404a] px-8 py-3 text-white font-semibold text-lg shadow"
                style={{ letterSpacing: ".5px" }}
              >
                Search Vehicle
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingFormSection;
