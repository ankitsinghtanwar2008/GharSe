"use client";

import { useRef, useState, useEffect } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface LocationDetails {
  city: string;
  state: string;
  area: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function LocationAccess() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [address, setAddress] = useState("");
  const [details, setDetails] = useState<LocationDetails>({
    city: "",
    state: "",
    area: "",
  });

  const [coords, setCoords] = useState<Coordinates | null>(null);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Load Google Maps Script
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  }, []);

  // Close dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAddress(value);

    if (!window.google || value.length < 2) return;

    const service =
      new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: value,
        componentRestrictions: { country: "in" },
      },
      (predictions: any[]) => {
        setSuggestions(predictions || []);
        setShowDropdown(true);
      }
    );
  };

  const extractDetails = (components: any[]): LocationDetails => {
    let city = "";
    let state = "";
    let area = "";

    components.forEach((comp) => {
      if (comp.types.includes("locality"))
        city = comp.long_name;

      if (
        comp.types.includes("administrative_area_level_1")
      )
        state = comp.long_name;

      if (
        comp.types.includes("sublocality") ||
        comp.types.includes("sublocality_level_1")
      )
        area = comp.long_name;
    });

    return { city, state, area };
  };

  const selectLocation = (item: any) => {
    if (!window.google) return;

    const service =
      new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

    service.getDetails(
      {
        placeId: item.place_id,
        fields: [
          "address_components",
          "geometry",
          "formatted_address",
        ],
      },
      (place: any) => {
        if (!place) return;

        const extracted = extractDetails(
          place.address_components
        );

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

  const getNearbyRestaurants = (
    lat: number,
    lng: number
  ) => {
    if (!window.google) return;

    const service =
      new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

    service.nearbySearch(
      {
        location: { lat, lng },
        radius: 2000,
        type: "restaurant",
      },
      (results: any[]) => {
        setRestaurants(results || []);
      }
    );
  };

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

          {showDropdown && (
            <div className="absolute top-14 left-0 w-full bg-white shadow-xl rounded-xl z-[999] max-h-80 overflow-y-auto">

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

              <div
                onClick={getCurrentLocation}
                className="p-3 text-orange-500 cursor-pointer border-b"
              >
                📍 Use current location
              </div>

              {restaurants.length > 0 && (
                <>
                  <div className="p-2 text-xs text-gray-400">
                    Nearby Restaurants
                  </div>

                  {restaurants.slice(0, 5).map((r: any, i) => (
                    <div
                      key={i}
                      className="p-3 hover:bg-gray-100 border-b"
                    >
                      <p className="font-semibold">
                        🍔 {r.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {r.vicinity}
                      </p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center bg-white rounded-xl px-4 py-3 w-[55%] shadow-lg">
          <input
            placeholder="Search food..."
            className="w-full outline-none"
          />
        </div>
      </div>

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

      {details.city && (
        <div className="text-white mt-4 text-sm">
          📍 {details.area}, {details.city}, {details.state}
        </div>
      )}
    </div>
  );
}