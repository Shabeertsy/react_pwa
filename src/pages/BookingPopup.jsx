import { useState, useEffect, useRef } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import app from "../firebaseconfig";
import { baseUrl } from "../Constants";
import axios from "axios";

const BookingPopup = ({ onClose, distanceText, distanceValue, filledData, vehicle }) => {
  const getInitialForm = () => {
    const defaultForm = {
      client_name: "",
      phone: "",
      pickup: "",
      dropoff: "",
      pickupDate: "",
      pickupTime: "",
      returnDate: "",
      returnTime: "",
      tripType: "",
      view_points: "",
    };

    if (
      filledData &&
      typeof filledData === "object" &&
      Object.values(filledData).some(
        (v) => v !== undefined && v !== null && String(v).trim() !== ""
      )
    ) {
      const merged = { ...defaultForm };
      Object.keys(defaultForm).forEach((key) => {
        if (
          filledData[key] !== undefined &&
          filledData[key] !== null &&
          String(filledData[key]).trim() !== ""
        ) {
          merged[key] = filledData[key];
        }
      });
      return merged;
    }
    return defaultForm;
  };

  const [form, setForm] = useState(getInitialForm);
  const [step, setStep] = useState("form");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bypassAuth, setBypassAuth] = useState(true);
  const [tripTypes, setTripTypes] = useState([]);

  const otpRefs = useRef([]);
  const recaptchaRef = useRef(null);
  const auth = getAuth(app);

  useEffect(() => {
    const fetchTripTypes = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/list-trip-types/`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = response.data;
        if (Array.isArray(data)) {
          setTripTypes(data);
          if (data.length > 0 && !form.tripType) {
            setForm((prev) => ({ ...prev, tripType: data[0].value }));
          }
        } else {
          setError("Failed to fetch trip types.");
        }
      } catch (err) {
        setError("Error fetching trip types: " + (err?.message || ""));
      }
    };
    fetchTripTypes();
  }, []);

  useEffect(() => {
    setForm(getInitialForm());
  }, [filledData]);

  useEffect(() => {
    if (bypassAuth) {
      setRecaptchaReady(true);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (error) {
          // ignore
        }
      }
      return;
    }

    if (!recaptchaRef.current) {
      setError("reCAPTCHA container not found.");
      return;
    }

    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaRef.current, {
          size: "normal",
          callback: () => {
            setRecaptchaReady(true);
          },
          "expired-callback": () => {
            setError("reCAPTCHA expired, please try again.");
            setRecaptchaReady(false);
            window.recaptchaVerifier = null;
          },
          "error-callback": (error) => {
            setError("reCAPTCHA error: " + (error.message || "Unknown error"));
            setRecaptchaReady(false);
            window.recaptchaVerifier = null;
          },
        });

        window.recaptchaVerifier.render().catch((error) => {
          setError("Failed to render reCAPTCHA: " + (error.message || "Unknown error"));
          setRecaptchaReady(false);
        });
      } catch (error) {
        setError("Failed to initialize reCAPTCHA: " + (error.message || "Unknown error"));
        setRecaptchaReady(false);
      }
    }

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (error) {
          // ignore
        }
      }
    };
  }, [auth, recaptchaRef, bypassAuth]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleOtpChange = (element, index) => {
    if (/^\d*$/.test(element.value)) {
      const newOtp = [...otp];
      newOtp[index] = element.value;
      setOtp(newOtp);

      if (element.value && index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.phone || form.phone.length < 10) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    if (bypassAuth) {
      await handleBooking();
      return;
    }

    if (!window.recaptchaVerifier) {
      setError("reCAPTCHA is not ready. Please wait and try again.");
      setLoading(false);
      return;
    }

    try {
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = form.phone.startsWith("+")
        ? form.phone
        : "+91" + form.phone;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      setVerificationId(confirmationResult.verificationId);
      setStep("otp");
      setOtp(new Array(6).fill(""));
    } catch (err) {
      if (err?.code === "auth/invalid-app-credential") {
        setError("Invalid app credential. Please check your Firebase configuration.");
      } else if (err?.code === "auth/internal-error") {
        setError(
          "Internal error occurred. Please check your phone number and try again."
        );
      } else if (err?.code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please enter a valid phone number.");
      } else {
        setError("OTP sending failed: " + (err?.message || "Try again."));
      }

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
          setRecaptchaReady(false);
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    setError("");
    setLoading(true);

    try {
      const pickupDateFormatted = formatDate(form.pickupDate);
      const returnDateFormatted = formatDate(form.returnDate);

      const tripStartDate = pickupDateFormatted || "";
      const tripEndDate = returnDateFormatted || "";

      const bookingPayload = {
        phone_number: form.phone,
        trip_type: form.tripType,
        owner_vehicle: vehicle?.id,
        trip_start_date: tripStartDate,
        trip_end_date: tripEndDate,
        from_location: form.pickup,
        to_location: form.dropoff,
        is_from_trip: !!form.returnDate,
        view_points: form.view_points,
        client_name:form.client_name
      };

      const response = await fetch(`${baseUrl}api/book-vehicle/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        let errMsg = "Booking failed";
        if (data && data.errors) {
          if (data.errors.trip_start_date) {
            errMsg += `: Start Date - ${data.errors.trip_start_date.join(", ")}`;
          }
          if (data.errors.trip_end_date) {
            errMsg += `: End Date - ${data.errors.trip_end_date.join(", ")}`;
          }
          // Accept both view_points and viewpoints for error reporting
          if (data.errors.view_points) {
            errMsg += `: Viewpoints - ${data.errors.view_points.join(", ")}`;
          }
          if (data.errors.viewpoints) {
            errMsg += `: Viewpoints - ${data.errors.viewpoints.join(", ")}`;
          }
        }
        setError(errMsg);
        setLoading(false);
        return;
      }

      onClose();
      alert("Booking successful!");
    } catch (err) {
      setError("Booking failed: " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);

    if (otp.some((digit) => digit === "")) {
      setError("Please enter the complete OTP.");
      setLoading(false);
      return;
    }

    const code = otp.join("");
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      await handleBooking();
    } catch (err) {
      if (err?.code === "auth/invalid-verification-code") {
        setError("Invalid OTP. Please check and try again.");
      } else {
        setError("OTP verification or booking failed: " + (err?.message || ""));
      }
    } finally {
      setLoading(false);
    }
  };

  let totalAmount = 0;
  if (distanceValue && vehicle) {
    const distanceKm = distanceValue / 1000;
    const minFare =
      Number(vehicle.minimum_fare) >= 0 ? Number(vehicle.minimum_fare) : 0;
    const perKmRate = Number(vehicle.per_kilometer_rate) || 0;

    if (minFare > 0) {
      if (distanceKm <= 100) {
        totalAmount = minFare;
      } else {
        totalAmount = minFare + Math.round((distanceKm - 100) * perKmRate);
      }
    } else {
      totalAmount = Math.round(distanceKm * perKmRate);
    }
  }

  const whiteTextInputStyle = { color: "#fff" };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div
        className="bg-[#323c3c] rounded-md p-10 w-full max-w-7xl relative"
        style={{ boxShadow: "0 10px 40px 0 rgba(0,0,0,0.18)" }}
      >
        <button
          className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
          onClick={onClose}
        >
          ×
        </button>

        {step === "form" && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                Book Your Vehicle
              </h2>
              {/* <label className="text-white mt-2 flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={bypassAuth}
                  onChange={(e) => setBypassAuth(e.target.checked)}
                  className="mr-2"
                />
                Bypass Authentication (Testing)
              </label> */}
            </div>

            <form className="grid grid-cols-2 gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-1 text-white">Name</label>
                <input
                  name="client_name"
                  placeholder="Enter your name"
                  className="bg-white text-dark p-2 w-full rounded"
                  value={form.client_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Phone Number</label>
                <input
                  name="phone"
                  placeholder="Enter your phone number"
                  className="bg-white text-dark p-2 w-full rounded"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Pick Up Location</label>
                <input
                  name="pickup"
                  placeholder="Enter your pickup location"
                  className="bg-white text-dark p-2 w-full rounded"
                  value={form.pickup}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Drop Off Location</label>
                <input
                  name="dropoff"
                  placeholder="Enter your dropoff location"
                  className="bg-white text-dark p-2 w-full rounded"
                  value={form.dropoff}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Trip Type</label>
                <select
                  name="tripType"
                  className="bg-white text-dark p-2 w-full rounded"
                  value={form.tripType}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="" style={{ color: "#000" }} disabled>
                    Choose a trip type
                  </option>
                  {tripTypes.map((type) => (
                    <option key={type.trip_type} value={type.id} style={{ color: "#000" }}>
                      {type.trip_type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-white">Viewpoints</label>
                <textarea
                  name="view_points"
                  placeholder="Enter any viewpoints or notes"
                  className="bg-white text-dark p-2 w-full rounded"
                  value={form.view_points}
                  onChange={handleChange}
                  disabled={loading}
                  rows="4"
                />
              </div>
              <div>
                <label className="block mb-1 text-white">Pick Up Date & Time</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="pickupDate"
                    className="bg-white text-dark border-r border-gray-300 p-2 w-2/3 rounded"
                    style={whiteTextInputStyle}
                    value={form.pickupDate}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <select
                    name="pickupTime"
                    className="bg-white text-dark p-2 w-1/3 rounded"
                    style={whiteTextInputStyle}
                    value={form.pickupTime}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option style={{ color: "#000" }}>Time</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i} style={{ color: "#000" }}>
                        {`${String(i).padStart(2, "0")}:00`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-white">Return Date & Time</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    name="returnDate"
                    className="bg-white text-dark p-2 border-r border-gray-300 w-2/3 rounded"
                    style={whiteTextInputStyle}
                    value={form.returnDate}
                    onChange={handleChange}
                    disabled={loading || form.tripType === "one-way"}
                  />
                  <select
                    name="returnTime"
                    className="bg-white text-dark p-2 w-1/3 rounded"
                    style={whiteTextInputStyle}
                    value={form.returnTime}
                    onChange={handleChange}
                    disabled={loading || form.tripType === "one-way"}
                  >
                    <option style={{ color: "#000" }}>Time</option>
                    {[...Array(24)].map((_, i) => (
                      <option key={i} style={{ color: "#000" }}>
                        {`${String(i).padStart(2, "0")}:00`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between pt-4 border-t border-gray-600 mt-4">
                <div className="text-white">
                  {distanceText && (
                    <p>
                      Distance:{" "}
                      <span className="font-semibold">{distanceText}</span>
                    </p>
                  )}
                  {totalAmount > 0 && (
                    <p>
                      Total Amount:{" "}
                      <span className="font-bold text-green-400">
                        ₹{totalAmount}
                      </span>
                    </p>
                  )}
                  {error && <p className="text-red-400 mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="bg-[#c0404a] rounded-md px-8 py-3 text-white font-semibold text-lg"
                  style={{ letterSpacing: ".5px" }}
                  disabled={!recaptchaReady || loading}
                >
                  {loading ? "Processing..." : bypassAuth ? "Book Now" : "Book Vehicle"}
                </button>
              </div>
            </form>
            {!bypassAuth && (
              <div
                id="recaptcha-container"
                ref={recaptchaRef}
                style={{ marginTop: 24, display: "flex", justifyContent: "center" }}
              />
            )}
          </>
        )}

        {step === "otp" && !bypassAuth && (
          <div>
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-white text-2xl"
              onClick={() => {
                setStep("form");
                setOtp(new Array(6).fill(""));
                setError("");
                setRecaptchaReady(false);
              }}
            >
              ×
            </button>

            <h2 className="text-white text-xl mb-4">Enter OTP</h2>

            <div className="flex space-x-2 justify-center mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  ref={(el) => (otpRefs.current[idx] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  className="w-10 h-10 text-center rounded bg-white text-black font-bold"
                  autoFocus={idx === 0}
                  disabled={loading}
                />
              ))}
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              className="bg-[#c0404a] rounded-md px-8 py-3 text-white font-semibold text-lg w-full"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Book"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPopup;