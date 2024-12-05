'use client'
import Image from "next/image";
import Head from 'next/head'
import { useActionState, useEffect, useState, useRef } from 'react'
import { handleForm, callOptimizeTours, getRoute } from '@/app/lib/actions'
import { useLoadScript } from "@react-google-maps/api";
import AddressInput from "../app/google-location-input"


// export const metadata: Metadata = {
//   title: "Admin App | DNA New Zealand"
// }

const libraries = ["places"];



const initialState = {
  message: '',
}






export default function Home() {
  const [customers, updateCustomers] = useState([1])

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    libraries,
  });

  const [state, formAction] = useActionState(handleForm, initialState);
  const [routeData, setRouteData] = useState();
  const [routeData2, setRouteData2] = useState();

  const [input, setInput] = useState({});
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);


  const updateFormWithCustomers = handleForm.bind(null, customers)


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

    const autocomplete2 = new google.maps.places.Autocomplete(inputRef2.current, options);
    autocomplete2.addListener("place_changed", () => handlePlaceChanged(autocomplete));

    // return () => autocomplete.removeListener("place_changed", handlePlaceChanged);
  }, [isLoaded, loadError]);


  //optimize routes api state update
  useEffect(() => {
    console.log("Route Data:", routeData)
    if (routeData){
      for (let i = 0; i < routeData[0].routes[0].visits.length; i++){
        console.log("Location "+ i +": ",routeData[0].routes[0].visits[i].startTime.seconds + " Seconds")
        console.log("Arrival Time "+ i +": ",)
      }
    }
  },[routeData])

  //routes api state update
  useEffect(() => {
    console.log("Route Data2:", routeData2);
    if (routeData2){
      for (let i = 0; i < routeData2[0].routes[0].legs.length; i++){
        console.log("~Step " + i)
        if(i === 0){console.log("Location: " + routeData2[0].routes[0].legs[i].startLocation.latLng.latitude + "," + routeData2[0].routes[0].legs[i].startLocation.latLng.longitude)}
        else {console.log("Location: " + routeData2[0].routes[0].legs[i].endLocation.latLng.latitude + "," + routeData2[0].routes[0].legs[i].endLocation.latLng.longitude)}
        console.log("Distance: "+ routeData2[0].routes[0].legs[i].localizedValues.distance.text + ", Time: " + routeData2[0].routes[0].legs[i].localizedValues.duration.text)
      }  
    }
  },[routeData2])


  console.log(customers)
  return (
    <div className="bg-slate-800 text-white">
      <Head>
        <title>Admin App | DNA New Zealand</title>
      </Head>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-6/12 mx-auto">
        <Image
          className="dark:invert"
          src="/dna-tours-logo.png"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
            <h1 className="text-5xl">Routing & Notifications App Demo</h1>
            <form className="w-full mb-36" action={formAction}>
              <h2 className="text-xl my-2">Please Add Driver Details:</h2>
              <div className="bg-white text-black mb-10 p-4 rounded">
                <div className="flex" >
                  <div className="w-6/12">
                    <label htmlFor="driver-name">Name:</label><br/>
                    <input id="driver-name" name="driver-name" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                  </div>
                  <div className=" w-6/12 ml-5">
                    <label >Email:</label><br/>
                    <input id="driver-email" name="driver-email" type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" ></input>
                  </div>
                </div>
                <div className="py-2">
                  <label>Start Location: </label><br/>
                  <input onChange={handleChange} ref={inputRef} id="driver-start" name="driver-start" type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"></input>
                </div>
                <div className="py-2">
                  <label>End Location: </label><br/>
                  <input onChange={handleChange} ref={inputRef2} id="driver-end" name="driver-end" type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"></input>
                </div>
              </div>
              <h2 className="text-xl my-2 mt-4">Please Add Customer Details:</h2>
              {/* <div>Hello {i}<button type="button" className="ml-5" onClick={() => updateCustomers(customers.filter(a => a !== i))}>Remove Me</button></div> */}
              <div className="rounded">
                {customers.map((i) => 
                  <div key={"customer" + i} className="text-black bg-white rounded my-1 px-4 py-1">
                    {i > 1?
                    <div className="flex">
                      <button className="text-xs ml-auto" type="button" onClick={() => { customers.length > 1 ? updateCustomers(customers.filter(a => a !== i)) : ""}}>(Remove)</button>
                    </div>
                    : null
                    }
                    <div className="flex rounded">
                      <div className="w-3/12 pb-1">
                        <label>Name:</label><br/>
                        <input id={"customer"+i+"-name"} name={"customer"+i+"-name"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <div className="w-3/12 ml-5 pb-1">
                        <label >Email: </label><br/>
                        <input id={"customer"+i+"-email"} name={"customer"+i+"-email"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <div className="w-6/12 ml-5 pb-1">
                        <label>Pickup Location: </label><br/>
                        <input id={"customer"+i+"-pickup"} name={"customer"+i+"-pickup"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                    </div>
                  
                  </div>
                )}
                <p>Total Customers: {customers.length}</p>
              </div>
              <div className="bg-white text-black mb-10 p-4 rounded">
                API Results:
                {routeData2 ? 
                  <div>
                    {routeData2[0].routes[0].legs.map((route, i) => {
                      return(
                      <div className="my-5" key={"Location " + i}>
                        Location {i + 1}: {i === 0 ? <span>{route.startLocation.latLng.latitude},{route.startLocation.latLng.longitude}</span>:
                      <span>{route.endLocation.latLng.latitude},{route.endLocation.latLng.longitude}</span>}
                      <p>Distance: {route.localizedValues.distance.text}, </p>
                      <p>Time: {route.localizedValues.duration.text}</p>
                      </div>
                      )})}
                  </div> 
                : null}
              </div>
              <AddressInput customers={customers}/>



              <div className="flex">
              <button type="submit" className="w-8/12 p-5 mt-5 rounded bg-indigo-600">Generate Route/Pickup Times</button>
              <button type="button" onClick={() => updateCustomers([...customers, customers[customers.length - 1] + 1])} className="grow p-5 mt-5 ml-4 bg-white text-black rounded">Add Customer</button>
              </div>
              
              
            </form>
      </main>

      <div>


      </div>

      <div className="flex justify-center mb-10">
        <button onClick={async () => {
          const route = await callOptimizeTours()
          setRouteData(route)
        }} 
        className="w-4/12 p-5 mt-5 rounded bg-indigo-600">
        Test Route Optimization API
        </button>

        <button 
        onClick={async () => {
          const route2 = await getRoute()
          setRouteData2(route2)
        }} 
        className="w-4/12 p-5 mt-5 ml-5 rounded bg-indigo-600">
        Test Route API
        </button>
      </div>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a></a>
      </footer>
    </div>
  );
}
