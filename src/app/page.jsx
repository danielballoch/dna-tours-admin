'use client'
import Image from "next/image";
import Head from 'next/head'
import { useActionState, useEffect, useState, useRef } from 'react'
import { handleForm } from '@/app/lib/actions'
import { useLoadScript } from "@react-google-maps/api";
import AddressInput from "./google-location-input"


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
  const [mapLink, setMapLink] = useState()

  // const [routeData, setRouteData] = useState();
  // const [routeData2, setRouteData2] = useState();

  const [input, setInput] = useState({});
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  console.log("State: ", state)
  


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


  //createMapLink
  useEffect(() => {
    if(state.CustomerData){
      console.log("run?")
      let mapString = "https://www.google.co.nz/maps/dir/"+state.DriverData.startLocation;
      if(state.customersArray.length > 1){
        for(let i = 0; i < state.customersArray.length; i++){
          mapString += "/"+state.CustomerData[state.routeData[0].routes[0].optimizedIntermediateWaypointIndex[i]].customerPickup;
        }
      } else mapString += "/"+state.CustomerData[0].customerPickup;
      mapString += "/"+state.DriverData?.endLocation;
      setMapLink(mapString);
    }
  },[state])
  


  //optimize routes api state update
  // useEffect(() => {
  //   console.log("Route Data:", routeData)
  //   if (routeData){
  //     for (let i = 0; i < routeData[0].routes[0].visits.length; i++){
  //       console.log("Location "+ i +": ",routeData[0].routes[0].visits[i].startTime.seconds + " Seconds")
  //       console.log("Arrival Time "+ i +": ",)
  //     }
  //   }
  // },[routeData])

  //routes api state update
  // useEffect(() => {
  //   console.log("Route Data2:", routeData2);
  //   if (routeData2){
  //     for (let i = 0; i < routeData2[0].routes[0].legs.length; i++){
  //       console.log("~Step " + i)
  //       if(i === 0){console.log("Location: " + routeData2[0].routes[0].legs[i].startLocation.latLng.latitude + "," + routeData2[0].routes[0].legs[i].startLocation.latLng.longitude)}
  //       else {console.log("Location: " + routeData2[0].routes[0].legs[i].endLocation.latLng.latitude + "," + routeData2[0].routes[0].legs[i].endLocation.latLng.longitude)}
  //       console.log("Distance: "+ routeData2[0].routes[0].legs[i].localizedValues.distance.text + ", Time: " + routeData2[0].routes[0].legs[i].localizedValues.duration.text)
  //     }  
  //   }
  // },[routeData2])


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
            <form className="w-full mb-8" action={formAction}>
              <h2 className="text-xl my-2">Please Add Driver Details:</h2>
              <div className="bg-white text-black mb-10 p-4 rounded">
                <div className="flex" >
                  <div className="w-6/12">
                    <label htmlFor="driver-name">Name:</label><br/>
                    <input placeholder="Name" id="driver-name" name="driver-name" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                  </div>
                  <div className=" w-6/12 ml-5">
                    <label >Email:</label><br/>
                    <input placeholder="Email" id="driver-email" name="driver-email" type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" ></input>
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
                <div className="py-2">
                  <label>Target Arrival Time: </label><br/>
                  <input id="target-arrival" name="target-arrival" type="time" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"></input>
                </div>
              </div>
              <h2 className="text-xl my-2 mt-4">Please Add Customer Details:</h2>
              {/* <div>Hello {i}<button type="button" className="ml-5" onClick={() => updateCustomers(customers.filter(a => a !== i))}>Remove Me</button></div> */}
              <div className="rounded bg-white py-4 my-1">
                {customers.map((i) => 
                  <div key={"customer" + i} className="text-black bg-white rounded px-4 ">
                    {i > 1?
                    <div className="flex">
                      <button className="text-xs ml-auto text-slate-600" type="button" onClick={() => { customers.length > 1 ? updateCustomers(customers.filter(a => a !== i)) : ""}}>(remove)</button>
                    </div>
                    : null
                    }
                    <div className="flex rounded">
                      <div className="w-3/12 pb-1">
                        {i === 1? <label>Name:</label>: null}
                        <input placeholder="Name" id={"customer"+i+"-name"} name={"customer"+i+"-name"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <div className="w-3/12 ml-5 pb-1">
                      {i === 1? <label>Email: </label> : null}
                        <input placeholder="Email" id={"customer"+i+"-email"} name={"customer"+i+"-email"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <AddressInput i={i}/>
                    </div>
                  
                  </div>
                )}
                {/* add number of customers so you can loop through in api */}
                <input type="hidden" name="numberOfCustomers" value={customers} />
                <p className="text-black pl-4 pt-2">Total Customers: {customers.length}</p>
              </div>
             

                {/* form buttons */}
              <div className="flex">
                <button type="submit" className="w-8/12 p-5 mt-5 rounded bg-indigo-600">Generate Route/Pickup Times</button>
                <button type="button" onClick={() => updateCustomers([...customers, customers[customers.length - 1] + 1])} className="grow p-5 mt-5 ml-4 bg-white text-black rounded">Add Customer</button>
              </div>
            </form>

            <h2 className="text-xl my-2 mt-4">Form Results + Route API (Dynamic Data):</h2>
              <div className="bg-white text-black p-4 rounded w-full" >
                {state.DriverData ?
                  <div>
                      <div className="my-5">
                        <h3 className="text-xl">Driver Details</h3>
                        <div>
                          <span>Name: {state.DriverData.driverName}</span>
                          <p>Email: {state.DriverData.driverEmail}</p>
                          <p>Start: {state.DriverData.startLocation}</p>
                          <p>End: {state.DriverData.endLocation}</p>
                        </div>
                      </div>
                      
                      <div className="my-5">
                        <h3 className="text-xl">Customer Details:</h3>
                        {state.CustomerData.map((customer, i) =>{
                          return(
                            <div key={"customerData"+i}>
                              <span className="w-3/12">{i+1}</span>
                              <span className="w-3/12 ml-5">{customer.customerName}</span>
                              <span className="w-3/12 ml-5">{customer.customerEmail}</span>
                              <span className="w-3/12 ml-5">{customer.customerPickup}</span>
                            </div>
                          )
                        })}
                      </div>
                      
                      <div>
                        <h3 className="text-xl">Optimized Route:</h3>
                        <div key={"customer start"}>
                                  <span className="w-3/12">1</span>
                                  <span className="w-3/12 ml-5">Start</span>
                                  <span className="w-3/12 ml-5">{state.DriverData.startLocation}</span>
                                  <span className="w-3/12 ml-5">4:00pm</span>
                        </div>
                        {state.routeData[0].routes[0].optimizedIntermediateWaypointIndex.map((order, i) => {
                          if(order === -1){order = 0}
                          return <div key={"customer"+i}>
                                  <span className="w-3/12">{i+2}</span>
                                  <span className="w-3/12 ml-5">{state.CustomerData[order].customerName}</span>
                                  <span className="w-3/12 ml-5">{state.CustomerData[order].customerPickup}</span>
                                  <span className="w-3/12 ml-5">+{state.routeData[0].routes[0].legs[i].localizedValues.duration.text}</span>
                                </div>
                        })}
                        <div key={"customer end"}>
                                  <span className="w-3/12">{state.routeData[0].routes[0].optimizedIntermediateWaypointIndex.length+2}</span>
                                  <span className="w-3/12 ml-5">End</span>
                                  <span className="w-3/12 ml-5">{state.DriverData.endLocation}</span>
                                  <span className="w-3/12 ml-5">4:00pm + {state.routeData[0].routes[0].localizedValues.duration.text}</span>
                        </div>
                        <div className="mt-2">
                          <span >Number of pickups: {state.customersArray.length}</span>
                          <span className="w-3/12 ml-5">Route Duration: {state.routeData[0].routes[0].localizedValues.duration.text}</span>
                          <span className="w-3/12 ml-5">Distance: {state.routeData[0].routes[0].localizedValues.distance.text}</span>
                        </div>
                        <a className="mt-8" target="blank" href={mapLink}>Google Maps Route (CLICK)</a>
                      </div>
                  </div> 
                : null}
              </div>
               {/* form buttons */}
               <div className="flex w-full mb-10">
                <button type="submit" className="w-full p-5 mt-5 rounded bg-indigo-600">Send to Driver + Customers</button>
              </div>

              {/* <div className="bg-white text-black mb-10 p-4 rounded w-full">
                Route API (Static Data):
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
              </div> */}

      </main>


      {/* <div className="flex justify-center mb-10">
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
      </div> */}
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a></a>
      </footer>
    </div>
  );
}
