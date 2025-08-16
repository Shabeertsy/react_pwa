import { useState } from "react";

const BookingPopup = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pickup: "",
    dropoff: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: ""
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onClose();
  };

  // Custom style for white text in date and time inputs
  const whiteTextInputStyle = { color: "#fff" };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div
        className="bg-[#323c3c] rounded-md p-10 w-full max-w-7xl relative"
        style={{ boxShadow: "0 10px 40px 0 rgba(0,0,0,0.18)" }}
      >
        <button className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl" onClick={onClose}>
          ×
        </button>
        <div className="text-white text-base mb-5 font-medium">For enquiry complete the form</div>
        <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="text-white block mb-1">Name</label>
            <input
              name="name"
              placeholder="Enter your name"
              className="bg-white p-2 w-full rounded"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white block mb-1">Phone Number</label>
            <input
              name="phone"
              placeholder="Enter your phone number"
              className="bg-white p-2 w-full rounded"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white block mb-1">Pick Up Location</label>
            <input
              name="pickup"
              placeholder="Enter your pickup location"
              className="bg-white p-2 w-full rounded"
              value={form.pickup}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white block mb-1">Drop Off Location</label>
            <input
              name="dropoff"
              placeholder="Enter your dropoff location"
              className="bg-white p-2 w-full rounded"
              value={form.dropoff}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-white block mb-1">Pick Up Date & Time</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="pickupDate"
                className="bg-white text-dark border-r border-gray-300  p-2  w-2/3"
                style={whiteTextInputStyle}
                value={form.pickupDate}
                onChange={handleChange}
              />
              <select
                name="pickupTime"
                className="bg-white text-dark p-2  w-1/3"
                style={whiteTextInputStyle}
                value={form.pickupTime}
                onChange={handleChange}
              >
                <option style={{ color: "#000" }}>Time</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} style={{ color: "#000" }}>{`${String(i).padStart(2, "0")}:00`}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-white block mb-1">Return Date & Time</label>
            <div className="flex space-x-2">
              <input
                type="date"
                name="returnDate"
                className="bg-white text-dark p-2 border-r border-gray-300  w-2/3"
                style={whiteTextInputStyle}
                value={form.returnDate}
                onChange={handleChange}
              />
              <select
                name="returnTime"
                className="bg-white text-dark p-2  w-1/3"
                style={whiteTextInputStyle}
                value={form.returnTime}
                onChange={handleChange}
              >
                <option style={{ color: "#000" }}>Time</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} style={{ color: "#000" }}>{`${String(i).padStart(2, "0")}:00`}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-2 pt-3">
            <button
              type="submit"
              className="bg-[#c0404a] rounded-md px-8 py-3 text-white font-semibold text-lg"
              style={{ letterSpacing: ".5px" }}
            >
              Book Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPopup;