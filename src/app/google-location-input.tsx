'use client'
import { useEffect, useState, useRef } from 'react'
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

export default function AddressInput({i}) {

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
        libraries,
    });

    const [input, setInput] = useState({});
    const inputRef = useRef(null);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setInput((values) => ({ ...values, [name]: value }));
      };
    
    const handlePlaceChanged = async(address) => {
      if (!isLoaded) return;
      const place = address.getPlace()

      if (!place || !place.geometry) {
        setInput({});
        return;
      }
    };

    //places autocomplete api update
  useEffect(() => {
    if (!isLoaded || loadError) return;

    const options = {
      componentRestrictions: { country: "nz" },
      fields: ["address_components", "geometry"],
    };

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
    autocomplete.addListener("place_changed", () => handlePlaceChanged(autocomplete));


    // return () => autocomplete.removeListener("place_changed", handlePlaceChanged);
    }, [isLoaded, loadError]);

    return(
        <div className="w-6/12 ml-5 pb-1">
          {i === 1? <label>Pickup Location: </label> : null}
          <input ref={inputRef} id={"customer"+i+"-pickup"} name={"customer"+i+"-pickup"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
        </div>
    )
}