import { useState, useEffect, useRef, useCallback } from "react";
import Slider from "react-slick";
import axios from "axios";
import { baseUrl } from "../Constants";
import Loader from "../components/Loader";

const suggestionCache = new Map();

// Levenshtein distance function for typo correction
const levenshteinDistance = (a, b) => {
  const matrix = Array(b.length + 1)
    .fill()
    .map(() => Array(a.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  return matrix[b.length][a.length];
};

const correctedCity = (query, suggestions) => {
  if (!suggestions || suggestions.length === 0) {
    return { city: query, placeId: null };
  }
  let minDistance = Infinity;
  let bestMatch = null;
  suggestions.forEach((suggestion) => {
    if (suggestion.city) {
      const dist = levenshteinDistance(query.toLowerCase(), suggestion.city.toLowerCase());
      if (dist < minDistance && dist <= 3) {
        minDistance = dist;
        bestMatch = suggestion;
      }
    } else {
      console.warn("Invalid suggestion format:", suggestion);
    }
  });
  if (bestMatch) {
    return { city: bestMatch.city, placeId: bestMatch.id };
  }
  return { city: query, placeId: null };
};

const BookingFormSection = ({ onSubmit, onPickupChange, setDistanceText, setDistanceValue, setForm, form }) => {
  const today = new Date().toISOString().split("T")[0];

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [typesError, setTypesError] = useState(null);
  const [pickupSuggestions, setPickupSuggestions] = useState({ results: [], more: false, page: 1, query: "" });
  const [dropoffSuggestions, setDropoffSuggestions] = useState({ results: [], more: false, page: 1, query: "" });
  const [pickupCoords, setPickupCoords] = useState({ lat: null, lng: null });
  const [dropoffCoords, setDropoffCoords] = useState({ lat: null, lng: null });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState({ pickup: false, dropoff: false });
  const [searchResults, setSearchResults] = useState([]);
  const [suggestionSelected, setSuggestionSelected] = useState({ pickup: false, dropoff: false });

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  const fetchDistance = () => {
    if (!pickupCoords.lat || !pickupCoords.lng || !dropoffCoords.lat || !dropoffCoords.lng) {
      console.log("Coordinates missing:", { pickupCoords, dropoffCoords });
      setDistanceText("");
      setDistanceValue(null);
      return;
    }

    if (!window.google || !window.google.maps) {
      setDistanceText("Google Maps not loaded");
      setDistanceValue(null);
      return;
    }

    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [new window.google.maps.LatLng(pickupCoords.lat, pickupCoords.lng)],
        destinations: [new window.google.maps.LatLng(dropoffCoords.lat, dropoffCoords.lng)],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (
          status === "OK" &&
          response.rows &&
          response.rows.length > 0 &&
          response.rows[0].elements &&
          response.rows[0].elements.length > 0 &&
          response.rows[0].elements[0].status === "OK"
        ) {
          const element = response.rows[0].elements[0];
          setDistanceText(element.distance.text);
          setDistanceValue(element.distance.value);
          console.log("Distance fetched:", element.distance.text);
        } else {
          console.log("Distance fetch failed:", { status, response });
          setDistanceText(status === "OK" ? "Distance not available" : "Error fetching distance");
          setDistanceValue(null);
        }
      }
    );
  };

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setLoadingTypes(true);
      setTypesError(null);
      try {
        const response = await axios.get(`${baseUrl}api/list-vehicle-types/`);
        let types = response.data;
        if (Array.isArray(types)) {
          const normalizedTypes = types.map((type) => ({
            id: type.id ?? type.vehicle_type ?? JSON.stringify(type),
            label: type.label ?? type.vehicle_type ?? "Unknown",
            seat_capacity: type.seat_capacity ?? "-",
            type_name: type.type_name ?? type.label ?? type.vehicle_type ?? "Unknown",
            icon: type.icon ?? null,
          }));
          setVehicleTypes(normalizedTypes);
        }
      } catch {
        setTypesError("Failed to load vehicle types");
        setVehicleTypes([]);
      } finally {
        setLoadingTypes(false);
      }
    };
    fetchVehicleTypes();
  }, []);

  const fetchLocationSuggestions = useCallback(async (query, forField, page = 1) => {
    if (!query || query.length < 2) {
      if (forField === "pickup") setPickupSuggestions({ results: [], more: false, page: 1, query: "" });
      else setDropoffSuggestions({ results: [], more: false, page: 1, query: "" });
      setIsLoadingSuggestions((prev) => ({ ...prev, [forField]: false }));
      return [];
    }

    const cacheKey = `${forField}-${query}-${page}`;
    if (suggestionCache.has(cacheKey)) {
      const cached = suggestionCache.get(cacheKey);
      if (forField === "pickup") {
        setPickupSuggestions({ results: cached.results, more: cached.more, page, query });
      } else {
        setDropoffSuggestions({ results: cached.results, more: cached.more, page, query });
      }
      setIsLoadingSuggestions((prev) => ({ ...prev, [forField]: false }));
      return cached.results;
    }

    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API not loaded");
      setIsLoadingSuggestions((prev) => ({ ...prev, [forField]: false }));
      return [];
    }

    setIsLoadingSuggestions((prev) => ({ ...prev, [forField]: true }));
    const autocompleteService = new window.google.maps.places.AutocompleteService();
    try {
      const response = await new Promise((resolve, reject) => {
        autocompleteService.getPlacePredictions(
          {
            input: query,
            types: ["(regions)"],
            componentRestrictions: { country: "in" },
          },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              console.log("Raw Google Places API Response for", forField, ":", JSON.stringify(predictions, null, 2));
              resolve(predictions || []);
            } else {
              console.error("Google Places API error:", status);
              reject(new Error(status));
            }
          }
        );
      });

      const suggestions = response
        .map((prediction) => {
          const terms = prediction.structured_formatting?.secondary_text?.split(", ") || [];
          if (terms.some((term) => term.includes("India"))) {
            return {
              id: prediction.place_id,
              city: prediction.structured_formatting?.main_text || prediction.description || "",
              district: terms[0] || "",
              state: terms[1] || "",
              lat: null,
              lng: null,
            };
          }
          return null;
        })
        .filter((suggestion) => suggestion !== null);

      if (suggestions.length > 0) {
        suggestionCache.set(cacheKey, { results: suggestions, more: false });
      }

      if (forField === "pickup") {
        setPickupSuggestions({ results: suggestions, more: false, page, query });
      } else {
        setDropoffSuggestions({ results: suggestions, more: false, page, query });
      }
      return suggestions;
    } catch (error) {
      console.error(`Google API error for ${forField}:`, error);
      try {
        const response = await axios.get(`${baseUrl}api/location-search-by-map/`, {
          params: { q: query, page, country: "in" },
        });
        const suggestions = Array.isArray(response.data.results)
          ? response.data.results.filter((suggestion) =>
              suggestion.state?.toLowerCase().includes("india") ||
              suggestion.district?.toLowerCase().includes("india") ||
              suggestion.city?.toLowerCase().includes("india")
            )
          : [];
        if (forField === "pickup") {
          setPickupSuggestions({
            results: suggestions,
            more: response.data.pagination?.more || false,
            page,
            query,
          });
        } else {
          setDropoffSuggestions({
            results: suggestions,
            more: response.data.pagination?.more || false,
            page,
            query,
          });
        }
        if (suggestions.length > 0) {
          suggestionCache.set(cacheKey, { results: suggestions, more: false });
        }
        return suggestions;
      } catch (backendError) {
        console.error(`Backend API error for ${forField}:`, backendError);
        if (forField === "pickup") setPickupSuggestions({ results: [], more: false, page: 1, query: "" });
        else setDropoffSuggestions({ results: [], more: false, page: 1, query: "" });
        return [];
      }
    } finally {
      setIsLoadingSuggestions((prev) => ({ ...prev, [forField]: false }));
    }
  }, []);

  const fetchPlaceDetails = (placeId, forField) => {
    if (!placeId || !window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Cannot fetch place details:", { placeId, googleAvailable: !!window.google });
      return;
    }
    const placesService = new window.google.maps.places.PlacesService(document.createElement("div"));
    placesService.getDetails(
      { placeId, fields: ["geometry"] },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          if (lat >= 6 && lat <= 37 && lng >= 68 && lng <= 97) {
            console.log(`Place details for ${forField}:`, { placeId, lat, lng });
            if (forField === "pickup") {
              setPickupCoords({ lat, lng });
              if (typeof onPickupChange === "function") {
                onPickupChange({ lat, lng });
              }
            } else {
              setDropoffCoords({ lat, lng });
            }
          } else {
            console.error(`Location outside India for ${forField}:`, { lat, lng });
            alert("Selected location is not in India.");
          }
        } else {
          console.error(`Failed to fetch place details for ${forField}:`, { status, place });
        }
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Reset suggestionSelected when user types to allow new suggestions
    if (name === "pickup") {
      setSuggestionSelected((prev) => ({ ...prev, pickup: false }));
      fetchLocationSuggestions(value, "pickup", 1);
      setPickupCoords({ lat: null, lng: null });
    }
    if (name === "dropoff") {
      setSuggestionSelected((prev) => ({ ...prev, dropoff: false }));
      fetchLocationSuggestions(value, "dropoff", 1);
      setDropoffCoords({ lat: null, lng: null });
    }
  };

  const handlePickupBlur = async () => {
    console.log("handlePickupBlur called", { pickup: form.pickup, suggestionSelected: suggestionSelected.pickup });
    // Completely skip blur processing if a suggestion was selected
    if (suggestionSelected.pickup) {
      setPickupSuggestions((prev) => ({ ...prev, results: [] }));
      return;
    }
    // Only validate if no suggestion was selected and input is non-empty
    if (form.pickup && form.pickup.length >= 2) {
      const suggestions = await fetchLocationSuggestions(form.pickup, "pickup", 1);
      if (suggestions.length > 0) {
        const corrected = correctedCity(form.pickup, suggestions);
        setForm((prev) => ({ ...prev, pickup: corrected.city }));
        if (corrected.placeId) {
          fetchPlaceDetails(corrected.placeId, "pickup");
        }
      } else {
        console.log("No suggestions found for pickup:", form.pickup);
        alert("Please enter a valid location in India.");
      }
      setPickupSuggestions((prev) => ({ ...prev, results: [] }));
    }
  };

  const handleDropoffBlur = async () => {
    console.log("handleDropoffBlur called", { dropoff: form.dropoff, suggestionSelected: suggestionSelected.dropoff });
    // Completely skip blur processing if a suggestion was selected
    if (suggestionSelected.dropoff) {
      setDropoffSuggestions((prev) => ({ ...prev, results: [] }));
      return;
    }
    // Only validate if no suggestion was selected and input is non-empty
    if (form.dropoff && form.dropoff.length >= 2) {
      const suggestions = await fetchLocationSuggestions(form.dropoff, "dropoff", 1);
      if (suggestions.length > 0) {
        const corrected = correctedCity(form.dropoff, suggestions);
        setForm((prev) => ({ ...prev, dropoff: corrected.city }));
        if (corrected.placeId) {
          fetchPlaceDetails(corrected.placeId, "dropoff");
        }
      } else {
        console.log("No suggestions found for dropoff:", form.dropoff);
        alert("Please enter a valid location in India.");
      }
      setDropoffSuggestions((prev) => ({ ...prev, results: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
    const params = {
      lat: pickupCoords.lat ?? null,
      lng: pickupCoords.lng ?? null,
      type: form.vehicleType || null,
    };
    fetchDistance();
    try {
      const response = await axios.get(`${baseUrl}api/list-owner-vehicles/`, { params });
      setSearchResults(response.data);
      if (typeof onSubmit === "function") {
        onSubmit(response.data);
      }
    } catch (error) {
      console.error("Search API error:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickupRef.current && !pickupRef.current.contains(event.target)) {
        setPickupSuggestions((prev) => ({ ...prev, results: [] }));
      }
      if (dropoffRef.current && !dropoffRef.current.contains(event.target)) {
        setDropoffSuggestions((prev) => ({ ...prev, results: [] }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}api/list-banner-images/`);
        const urls = Array.isArray(response.data) ? response.data.map((item) => item.url) : [];
        setImageUrls(urls);
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchData();
  }, []);

  const generateTimeOptions = () =>
    [...Array(24)].map((_, i) => {
      const time = `${String(i).padStart(2, "0")}:00`;
      return <option key={i} value={time}>{time}</option>;
    });

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  return (
    <section className="relative w-screen md:h-[70vh] lg:h-[70vh] overflow-hidden">
      <Slider {...sliderSettings} className="w-screen md:h-[70vh] lg:h-[70vh]">
        {imageUrls.map((url, i) => (
          <div key={i} className="w-screen min-h-screen md:h-[70vh] lg:h-[70vh]">
            <img
              src={url}
              alt={`slide-${i}`}
              className="w-full w-screen min-h-screen md:h-[70vh] lg:h-[70vh]"
              loading="lazy"
            />
          </div>
        ))}
      </Slider>

      <div className="absolute inset-0 bg-black/50 z-10"></div>

      <div className="absolute inset-0 flex items-center justify-center z-10 mt-10 px-4">
        <div className="container max-w-5xl w-full">
          <form
            onSubmit={handleSubmit}
            className="bg-[#767676]/90 rounded px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-end shadow-lg"
            autoComplete="off"
          >
            <div>
              <div className="relative" ref={pickupRef}>
                <label className="text-white block font-medium">Pick Up Location</label>
                <div className="relative">
                  <input
                    name="pickup"
                    placeholder="Enter your pickup location"
                    value={form.pickup}
                    onChange={handleChange}
                    onBlur={handlePickupBlur}
                    className="bg-white px-2 py-2 w-full outline-none rounded"
                    autoComplete="off"
                    required
                  />
                  {isLoadingSuggestions.pickup && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">Loading...</span>
                  )}
                </div>
                {pickupSuggestions.results.length > 0 && (
                  <ul className="bg-white border border-gray-300 max-h-48 overflow-auto mt-1 rounded shadow-md absolute z-50 w-full">
                    {pickupSuggestions.results.map((item) => (
                      <li
                        key={item.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer rounded"
                        onMouseDown={() => {
                          setForm((prev) => ({ ...prev, pickup: item.city })); 
                          setSuggestionSelected((prev) => ({ ...prev, pickup: true })); 
                          fetchPlaceDetails(item.id, "pickup"); 
                          setPickupSuggestions((prev) => ({ ...prev, results: [] })); 
                        }}
                      >
                        <span className="font-semibold">{item.city}</span>
                        {item.district && <span className="text-gray-500 text-xs ml-1">{item.district}</span>}
                        {item.state && <span className="text-gray-400 text-xs ml-1">{item.state}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="text-white block font-medium mt-4">Return Date & Time</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="returnDate"
                  min={form.pickupDate}
                  className="bg-white border-r border-gray-300 px-2 py-2 w-2/3 outline-none rounded-l"
                  value={form.returnDate}
                  onChange={handleChange}
                />
                <select
                  name="returnTime"
                  className="bg-white px-2 py-2 w-1/3 outline-none rounded-r"
                  value={form.returnTime}
                  onChange={handleChange}
                >
                  <option value="">Time</option>
                  {generateTimeOptions()}
                </select>
              </div>
            </div>

            <div>
              <div className="relative" ref={dropoffRef}>
                <label className="text-white block font-medium">Drop Off Location</label>
                <div className="relative">
                  <input
                    name="dropoff"
                    placeholder="Enter your dropoff location"
                    value={form.dropoff}
                    onChange={handleChange}
                    onBlur={handleDropoffBlur}
                    className="bg-white px-2 py-2 w-full outline-none rounded"
                    autoComplete="off"
                  />
                  {isLoadingSuggestions.dropoff && (
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">Loading....</span>
                  )}
                </div>
                {dropoffSuggestions.results.length > 0 && (
                  <ul className="bg-white border border-gray-300 max-h-48 overflow-auto mt-1 rounded shadow-md absolute z-50 w-full">
                    {dropoffSuggestions.results.map((item) => (
                      <li
                        key={item.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer rounded"
                        onMouseDown={() => {
                          setForm((prev) => ({ ...prev, dropoff: item.city })); // Set exact city from suggestion
                          setSuggestionSelected((prev) => ({ ...prev, dropoff: true })); // Mark as selected
                          fetchPlaceDetails(item.id, "dropoff"); // Fetch coordinates
                          setDropoffSuggestions((prev) => ({ ...prev, results: [] })); // Clear suggestions immediately
                        }}
                      >
                        <span className="font-semibold">{item.city}</span>
                        {item.district && <span className="text-gray-500 text-xs ml-1">{item.district}</span>}
                        {item.state && <span className="text-gray-400 text-xs ml-1">{item.state}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <label className="text-white block font-medium mt-4">Pick Up Date & Time</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  name="pickupDate"
                  min={today}
                  className="bg-white border-r border-gray-300 px-2 py-2 w-2/3 outline-none rounded-l"
                  value={form.pickupDate}
                  onChange={handleChange}
                />
                <select
                  name="pickupTime"
                  className="bg-white px-2 py-2 w-1/3 outline-none rounded-r"
                  value={form.pickupTime}
                  onChange={handleChange}
                >
                  <option value="">Time</option>
                  {generateTimeOptions()}
                </select>
              </div>
            </div>

            <div className="flex flex-col justify-start h-full">
              <div>
                <label className="text-white block font-medium">Vehicle Type</label>
                <div className="relative">
                  <select
                    name="vehicleType"
                    className="appearance-none bg-white px-2 py-2 w-full outline-none text-base shadow-md border border-gray-300 focus:ring-2 focus:ring-[#c0404a] focus:border-[#c0404a] rounded transition"
                    value={form.vehicleType}
                    onChange={handleChange}
                    disabled={loadingTypes || !!typesError}
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
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
                    ▼
                  </span>
                </div>
              </div>

              <div className="flex justify-center items-start mt-4 md:mt-2">
                <button
                  type="submit"
                  className="bg-[#c0404a] px-8 py-3 text-white font-semibold text-lg shadow rounded w-full md:w-auto"
                  style={{ letterSpacing: ".5px" }}
                >
                  Search Vehicle
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingFormSection;