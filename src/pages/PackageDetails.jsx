import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../Constants";
import BookingPopup from "./BookingPopup"; 


function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [error, setError] = useState(null);
  const [showBooking, setShowBooking] = useState(false); 


  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`${baseUrl}api/package-detail/${id}/`)
      .then((res) => {
        setPkg(res.data);
        setLoading(false);
        setImgIdx(0);
      })
      .catch((err) => {
        setError("Failed to load package details.");
        setLoading(false);
      });
  }, [id]);

  const images = pkg?.images?.length ? pkg.images : [];

  const handlePrev = () => setImgIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const handleNext = () => setImgIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c0404a]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <p className="text-lg font-semibold">{error}</p>
        <Link to="/" className="mt-4 text-[#c0404a] underline">Back to Home</Link>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-600">
        <p className="text-lg font-semibold">Package not found.</p>
        <Link to="/" className="mt-4 text-[#c0404a] underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl mt-10 mb-16 overflow-hidden border border-gray-200">
      {/* Image Carousel */}
      <div className="relative h-72 bg-gray-100">
        {images.length > 0 ? (
          <img
            src={images[imgIdx]}
            alt={pkg.name}
            className="w-full h-72 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-72 flex items-center justify-center bg-gray-100">
            <img
              src="/logo-light.png"
              alt="Default Package"
              className="w-32 h-32 object-contain opacity-60"
              loading="lazy"
            />
          </div>
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#c0404a] p-2 rounded-full shadow hover:bg-[#c0404a] hover:text-white transition"
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
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 text-[#c0404a] p-2 rounded-full shadow hover:bg-[#c0404a] hover:text-white transition"
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
        <div className="absolute top-4 left-0 bg-gradient-to-r from-[#c0404a] to-[#e57373] text-white px-5 py-1 rounded-r-full font-semibold text-xs tracking-widest shadow-md z-10">
          Package Offer
        </div>
      </div>

      {/* Details */}
      <div className="p-8">
        {pkg.head_text && (
          <span className="text-sm uppercase font-semibold text-[#c0404a] tracking-wide mb-1 block">
            {pkg.head_text}
          </span>
        )}
        <h1 className="font-extrabold text-3xl mb-3 text-gray-800 leading-tight">
          {pkg.name}
        </h1>
        {(pkg.from_date || pkg.to_date) && (
          <div className="flex items-center text-sm text-gray-500 mb-2 gap-4">
            {pkg.from_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" className="stroke-current" />
                  <path d="M16 2v4M8 2v4M3 10h18" className="stroke-current" />
                </svg>
                <span className="font-medium">From:</span> {formatDate(pkg.from_date)}
              </span>
            )}
            {pkg.to_date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 2h12M6 22h12M6 2c0 7 6 7 6 10s-6 3-6 10M18 2c0 7-6 7-6 10s6 3 6 10" className="stroke-current" />
                </svg>
                <span className="font-medium">To:</span> {formatDate(pkg.to_date)}
              </span>
            )}
          </div>
        )}

        {(pkg.start_location_text || pkg.destination_text) && (
          <div className="text-sm text-gray-500 mb-2">
            {pkg.start_location_text && (
              <p className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="5" width="18" height="12" rx="3" className="stroke-current" />
                  <circle cx="7.5" cy="17.5" r="1.5" className="stroke-current" />
                  <circle cx="16.5" cy="17.5" r="1.5" className="stroke-current" />
                  <path d="M3 10h18" className="stroke-current" />
                </svg>
                <span className="font-medium">Start:</span> {pkg.start_location_text}
              </p>
            )}
            {pkg.destination_text && (
              <p className="flex items-center gap-1">
                <svg className="w-4 h-4 text-[#c0404a]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 21c-4.5-5-7-8.5-7-12A7 7 0 0 1 19 9c0 3.5-2.5 7-7 12z" className="stroke-current" />
                  <circle cx="12" cy="9" r="2.5" className="stroke-current" />
                </svg>
                <span className="font-medium">Destination:</span> {pkg.destination_text}
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

        {pkg.description && (
          <div className="mt-6 mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
            <div className="text-gray-700 text-base whitespace-pre-line">{pkg.description}</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
          {pkg.price && (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-[#c0404a]">
                ₹{pkg.price}
              </span>
              <span className="text-xs text-gray-500 font-semibold">/package</span>
            </div>
          )}
          <Link
            to="/"
            className="bg-gradient-to-r from-[#c0404a] to-[#e57373] text-white font-bold py-2 px-8 rounded-full shadow-lg hover:from-[#a8323a] hover:to-[#c0404a] transition-all duration-200 text-base flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 4h16v4a2 2 0 0 1-2 2h-2v4h2a2 2 0 0 1 2 2v4H4v-4a2 2 0 0 1-2-2V4z" className="stroke-current" />
            </svg>
            Back to Packages
          </Link>
         
          <button
            onClick={() => setShowBooking(true)} // ⬅ open popup
            className="bg-gradient-to-r from-[#c0404a] to-[#e57373] text-white font-bold py-2 px-8 rounded-full shadow-lg hover:from-[#a8323a] hover:to-[#c0404a] transition-all duration-200 text-base flex items-center gap-2"
            type="button"
          >
            Book Now
          </button>
  

        </div>
      </div>
       {/* Booking Popup */}
       {showBooking && (
        <BookingPopup pkg={pkg} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
