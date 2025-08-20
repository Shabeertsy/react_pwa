import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { baseUrl } from "../Constants";




function isAdActive(ad) {
  const now = new Date();
  const start = new Date(ad.start_date);
  const end = new Date(ad.end_date);
  return start <= now && now <= end;
}

const AdBlock = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    axios
      .get(`${baseUrl}api/list-custom-ads/`)
      .then((res) => {
        if (isMounted) {
          const activeAds = Array.isArray(res.data)
            ? res.data.filter(isAdActive)
            : [];
          setAds(activeAds);
        }
      })
      .catch(() => {
        if (isMounted) setAds([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);



  if (loading) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4 text-center text-gray-500">
          Loading ads...
        </div>
      </section>
    );
  }

  if (!ads.length) {
    return null;
  }

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <Slider {...settings}>
          {ads.map((ad, index) => (
            <div key={index} className="relative block overflow-hidden shadow">
              <img
                src={ad.image}
                alt={`Ad ${index + 1}`}
                className="w-full h-48 md:h-64 object-cover rounded"
              />
              <div className="absolute inset-0  flex flex-col justify-center items-center text-center p-4">
                <button
                  onClick={() => {
                    if (ad.link) window.open(ad.link, "_blank", "noopener");
                  }}
                  className="bg-[#c0404a] text-white font-bold py-2 px-6 rounded shadow-lg hover:bg-red-700 transition"
                  style={{ minWidth: 120 }}
                >
                  Visit Ad
                </button>
                <div className="mt-2 text-white text-xs">
                  {ad.start_date && ad.end_date && (
                    <>
                      Active:{" "}
                      {new Date(ad.start_date).toLocaleDateString()} -{" "}
                      {new Date(ad.end_date).toLocaleDateString()}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default AdBlock;