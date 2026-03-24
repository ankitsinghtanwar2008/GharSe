"use client";

import { useRef, useState, useEffect } from "react";

export default function LocationAccess() {
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [address, setAddress] = useState("");
  const [details, setDetails] = useState({ city: "", state: "", area: "" });
  const [coords, setCoords] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // ✅ Load Google Script
  useEffect(() => {
    if (window.google) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // 🔥 Input change → suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    if (!window.google || value.length < 2) return;

    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "in" },
      },
      (predictions) => {
        setSuggestions(predictions || []);
        setShowDropdown(true);
      }
    );
  };

  // ✅ Extract address details properly
  const extractDetails = (components) => {
    let city = "", state = "", area = "";

    components.forEach((comp) => {
      if (comp.types.includes("locality")) city = comp.long_name;
      if (comp.types.includes("administrative_area_level_1")) state = comp.long_name;
      if (
        comp.types.includes("sublocality") ||
        comp.types.includes("sublocality_level_1")
      ) {
        area = comp.long_name;
      }
    });

    return { city, state, area };
  };

  // ✅ Select location
  const selectLocation = (item) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.getDetails(
      {
        placeId: item.place_id,
        fields: ["address_components", "geometry", "formatted_address"],
      },
      (place) => {
        const extracted = extractDetails(place.address_components);

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setAddress(place.formatted_address);
        setDetails(extracted);
        setCoords({ lat, lng });

        setSuggestions([]);
        setShowDropdown(false);

        localStorage.setItem(
          "userLocation",
          JSON.stringify({
            address: place.formatted_address,
            details: extracted,
            coords: { lat, lng },
          })
        );

        getNearbyRestaurants(lat, lng);
      }
    );
  };

  // 🧠 Nearby restaurants
  const getNearbyRestaurants = (lat, lng) => {
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 2000,
        type: "restaurant",
      },
      (results) => {
        setRestaurants(results || []);
      }
    );
  };

  // 📍 Current location
  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCoords({ lat, lng });
      setShowMap(true);
      getNearbyRestaurants(lat, lng);
    });
  };

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div
        ref={dropdownRef}
        className="flex gap-4 w-[90%] max-w-5xl relative z-50"
      >
        {/* 📍 LOCATION */}
        <div className="relative flex items-center bg-white rounded-xl px-4 py-3 w-[45%] shadow-lg">
          <span className="mr-2 text-orange-500">📍</span>

          <input
            ref={inputRef}
            value={address}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search city, area..."
            className="w-full outline-none"
          />

          <button
            onClick={getCurrentLocation}
            className="text-xs ml-2 text-orange-500"
          >
            Locate
          </button>

          {/* 🔽 DROPDOWN */}
          {showDropdown && (
            <div className="absolute top-14 left-0 w-full bg-white shadow-xl rounded-xl z-[999] max-h-80 overflow-y-auto">
              {/* Suggestions */}
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => selectLocation(item)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                >
                  <p className="font-semibold text-sm">
                    {item.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.description}
                  </p>
                </div>
              ))}

              {/* Current location */}
              <div
                onClick={getCurrentLocation}
                className="p-3 text-orange-500 cursor-pointer border-b"
              >
                📍 Use current location
              </div>

              {/* Restaurants */}
              {restaurants.length > 0 && (
                <>
                  <div className="p-2 text-xs text-gray-400">
                    Nearby Restaurants
                  </div>
                  {restaurants.slice(0, 5).map((r, i) => (
                    <div key={i} className="p-3 hover:bg-gray-100 border-b">
                      <p className="text-sm font-semibold">🍔 {r.name}</p>
                      <p className="text-xs text-gray-500">{r.vicinity}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* 🔍 SEARCH */}
        <div className="flex items-center bg-white rounded-xl px-4 py-3 w-[55%] shadow-lg">
          <input
            placeholder="Search food..."
            className="w-full outline-none"
          />
        </div>
      </div>

      {/* 🗺️ MAP MODAL */}
      {showMap && coords && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white p-4 rounded-xl w-[650px] h-[450px] relative">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${coords.lat},${coords.lng}&z=15&output=embed`}
            />

            <button
              onClick={() => setShowMap(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 📦 Selected Info */}
      {details.city && (
        <div className="text-white mt-4 text-sm">
          📍 {details.area}, {details.city}, {details.state}
        </div>
      )}
    </div>
  );
}