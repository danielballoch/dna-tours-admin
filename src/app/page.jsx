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
  const [arrivalTimes, setArrivalTimes] = useState()

  // const [routeData, setRouteData] = useState();
  // const [routeData2, setRouteData2] = useState();

  const [input, setInput] = useState({});
  const inputRef = useRef(null);
  const inputRef2 = useRef(null);

  console.log("State: ", state)
  

  const setArrivalTime = () => {
    let arrivalTimeArray = []
    //will need to do for loop and go through each leg
    let ArrivalHour = Math.round(Number(state.DriverData.targetArrival.slice(0,2)));
    let ArrivalMinutes = Math.round(Number(state.DriverData.targetArrival.slice(-2)));
    for(let i = state.routeData[0].routes[0].legs.length-1; i >= 0; i--){
      //so this is in seconds, 60 seconds in a minutes, 60 minutes in an hour
      let legTime = Math.round(Number(state.routeData[0].routes[0].legs[i].duration.seconds)/60);
      console.log("leg time: ", legTime, "target min: ", ArrivalMinutes, "target hour: ", ArrivalHour)

      //The first case to check is if legtime < ArrivalMinutes I can just take it away simple
      if(legTime < ArrivalMinutes){
        console.log("Option 1 Ran")
        ArrivalMinutes = ArrivalMinutes-legTime;
        if(ArrivalMinutes < 10){
          arrivalTimeArray.push(ArrivalHour + ":" + "0"+ArrivalMinutes);
        } else {
          arrivalTimeArray.push(ArrivalHour + ":" + ArrivalMinutes);
        }
      } else {
        //otherwise if legtime is more than ArrivalMinutes I'll need to take away an hour, but 
        //I may need to take away more than an hour so I have to check 

        //At the moment I'm creating hours and minutes and figuring out what needs to be taken away... but
        //this doesn't account for the minutes already there.. 
        //so for a set all case I should do that first AND then do what I'm already doing. 
        //let's try that. 
        if(ArrivalMinutes === legTime){
          //The second case is if they're equal, in which case set arrival minutes 0
          console.log("Option 2 Ran")
          ArrivalMinutes = 0;
          arrivalTimeArray.push(ArrivalHour + ":" + "00");
        } 
        else if (ArrivalMinutes - legTime < 0){
          //The third is if ArrivalMinutes - legTime < 0
          console.log("Option 3 Ran")
          //first set minutes to 0 to make things simpler. 
          console.log('legb', legTime)
          legTime = legTime - ArrivalMinutes;
          ArrivalMinutes = 0;
          console.log('lega', legTime)
          //Now the first part of leg time is taken away so arrival minutes is 0. 
          //Now get the remainder of what needs taken away from ArrivalHour & Minutes.
          
          //looks like the problem is here, hours can be less than 1 but rounded up to one, then minutes returns negitive.
          //add a check
          let hours = 0;
          let minutes = 0;
          if (legTime/60 >= 1){
            hours = Math.round(legTime/60);
            minutes = Math.round((legTime/60 - hours)*60);
            ArrivalHour = ArrivalHour - hours;
            ArrivalMinutes = 60 - minutes;
          } else {
            //hours already === 0
            minutes = legTime;
            //need to add ArrivalHour - 1 since legTime is still more than minutes
            ArrivalHour = ArrivalHour - 1;
            ArrivalMinutes = 60 - minutes;
          }
          //does this work or can it still be negitive because of rounding?? test.
          
          console.log("before ",hours, minutes, ArrivalHour, ArrivalMinutes)
          console.log("after ",hours, minutes, ArrivalHour, ArrivalMinutes)
          //Now I do a similar check as option 2
          if(ArrivalMinutes === 60){
            console.log("option 3a outcome")
            ArrivalMinutes = 0;
            arrivalTimeArray.push(ArrivalHour + ":" + "00");
          } else if (ArrivalMinutes === 0){
            console.log("option 3b outcome")
            arrivalTimeArray.push(ArrivalHour + ":" + "00");
          } else if (ArrivalMinutes < 10) {
            console.log("option 3c outcome")
            arrivalTimeArray.push(ArrivalHour + ":" + "0"+ArrivalMinutes);
          } else {
            console.log("option 3d outcome")
            arrivalTimeArray.push(ArrivalHour + ":" + ArrivalMinutes);
          }
        }
      }
    } 
    setArrivalTimes(arrivalTimeArray);
        
    //     //old code
    //     console.log("Option 2 Ran")
    //     let hours = Math.round(legTime/60);
    //     let minutes = Math.round((legTime/60 - hours)*60);
    //     console.log(legTime/60, legTime/60-hours, (legTime/60 - hours)*60)
    //     console.log("test:", hours, minutes)
    //     //if arrival minutes - minutes > 
    //     if(minutes < 0){
    //       hours = hours + 1;
    //       console.log("test2: ", ArrivalMinutes-minutes, 60 - (ArrivalMinutes-minutes))
    //       ArrivalMinutes = 60 - (ArrivalMinutes-minutes);
    //     } else {
    //       ArrivalMinutes = ArrivalMinutes-minutes;
    //     }
    //     console.log("hours: ",hours, "minutes: ", minutes)
    //     console.log("Arrival Hours: ", ArrivalHour)
    //     console.log("Arrival Minutes: ", ArrivalMinutes)
    //     ArrivalHour = ArrivalHour - hours;
    //     arrivalTimeArray.push(ArrivalHour + ":" + ArrivalMinutes)
    //   }
    //   console.log("after set", ArrivalMinutes)
    // }
    // setArrivalTimes(arrivalTimeArray);
    // console.log(ArrivalHour)
    // console.log(ArrivalMinutes)
    return(
      console.log("arrival time", arrivalTimeArray)
      

    )
  }

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
      setArrivalTime();
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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mx-auto w-11/12 md:w-8/12">
      <div className="flex items-center mt-12 justify-center flex-col md:flex-row md:items-end">
        <Image
          className="dark:invert ml-2"
          src="/dna-tours-logo.png"
          alt="Next.js logo"
          width={178}
          height={40}
          priority
        />
        <h1 className="text-4xl pb-12 text-center">Routing & Notifications App</h1>
      </div>
            <form className="w-full mb-8" action={formAction}>
              
              <div className="bg-white text-black mb-10 p-8 rounded">
              <h2 className="text-3xl font-bold mb-8 mt-4 text-slate-700">Please Add Driver Details:</h2>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-6/12">
                    <label htmlFor="driver-name">Name:</label><br/>
                    <input placeholder="Name" id="driver-name" name="driver-name" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                  </div>
                  <div className="w-full md:w-6/12 md:ml-5">
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
              {/* </div> */}
              
              {/* <div>Hello {i}<button type="button" className="ml-5" onClick={() => updateCustomers(customers.filter(a => a !== i))}>Remove Me</button></div> */}
              {/* <div className="rounded bg-white py-8 my-1 px-8"> */}
              < h2 className="text-3xl font-bold mb-8 mt-8 text-slate-700">Please Add Customer Details:</h2>
                {customers.map((i) => 
                  <div key={"customer" + i} className="text-black bg-white rounded  ">
                    {i > 1?
                    <div className="flex">
                      <button className="text-xs ml-auto text-slate-600" type="button" onClick={() => { customers.length > 1 ? updateCustomers(customers.filter(a => a !== i)) : ""}}>(remove)</button>
                    </div>
                    : null
                    }
                    <div className="flex flex-col rounded md:flex-row">
                      <div className="w-full pb-1 md:w-3/12">
                        {i === 1? <label >Name:</label>: null}
                        <input placeholder="Name" id={"customer"+i+"-name"} name={"customer"+i+"-name"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <div className="w-full  pb-1 md:w-3/12 md:ml-5">
                      {i === 1? <label >Email: </label> : null}
                        <input placeholder="Email" id={"customer"+i+"-email"} name={"customer"+i+"-email"} className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <AddressInput i={i}/>
                    </div>
                  
                  </div>
                )}
                {/* add number of customers so you can loop through in api */}
                <input type="hidden" name="numberOfCustomers" value={customers} />
                <p className="text-black pt-2">Total Customers: {customers.length}</p>
                 {/* form buttons */}
              <div className="flex mt-4">
                <button type="submit" className="p-3 px-5 mt-5 rounded bg-slate-700 text-white font-bold">Generate Route/Pickup Times</button>
                <button type="button" onClick={() => updateCustomers([...customers, customers[customers.length - 1] + 1])} className="p-3 px-5 mt-5 ml-8 font-bold text-black bg-slate-500 text-white rounded hover:bg-slate-700 transition">Add Customer</button>
              </div>
              </div>
             

               
            </form>

            
              <div className="bg-white text-black py-10 px-10 rounded w-full mb-40" >
              <h2 className="text-3xl font-bold mb-8 mt-4 text-slate-700">Form Results + Route API (Dynamic Data):</h2>
                {!state.DriverData ? 
                <p>Results will load here once generated.</p>
                : null}
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
                        <h3 className="text-xl mb-2">Optimized Route:</h3>
                        <div key={"customer start"}>
                                  <span className="w-3/12">1</span>
                                  <span className="w-3/12 ml-5">Start</span>
                                  <span className="w-3/12 ml-5">{state.DriverData.startLocation}</span>
                                  {arrivalTimes? 
                                  <span className="w-3/12 ml-5">Leave {arrivalTimes[arrivalTimes.length-1]}</span>
                                  : null
                                  }
                        </div>
                        {state.routeData[0].routes[0].optimizedIntermediateWaypointIndex.map((order, i) => {
                          if(order === -1){order = 0}
                          return <div key={"customer"+i}>
                                  <span className="w-3/12">{i+2}</span>
                                  <span className="w-3/12 ml-5">{state.CustomerData[order].customerName}</span>
                                  <span className="w-3/12 ml-5">{state.CustomerData[order].customerPickup}</span>
                                  {arrivalTimes? 
                                  <span className="w-3/12 ml-5">ETA {arrivalTimes[arrivalTimes.length-i-2]} ({state.routeData[0].routes[0].legs[i].localizedValues.duration.text})</span>
                                    : null
                                  }
                                </div>
                        })}
                        <div key={"customer end"}>
                                  <span className="w-3/12">{state.routeData[0].routes[0].optimizedIntermediateWaypointIndex.length+2}</span>
                                  <span className="w-3/12 ml-5">End</span>
                                  <span className="w-3/12 ml-5">{state.DriverData.endLocation}</span>
                                  <span className="w-3/12 ml-5">Arrival {state.DriverData.targetArrival} ({state.routeData[0].routes[0].legs[state.routeData[0].routes[0].legs.length-1].localizedValues.duration.text})</span>
                        </div>
                        <div className="mt-2 mb-16">
                          <span>Number of pickups: {state.customersArray.length}</span>
                          <span className="w-3/12 ml-5">Route Duration: {state.routeData[0].routes[0].localizedValues.duration.text}</span>
                          <span className="w-3/12 ml-5">Distance: {state.routeData[0].routes[0].localizedValues.distance.text}</span>
                        </div>
                        <div className="flex w-full">
                        <button type="submit" className="p-3 px-5 mt-5 rounded bg-slate-700 text-white font-bold">Send to Driver + Customers</button>
                        <a className="p-3 px-5 mt-5 ml-8 font-bold text-black bg-slate-500 text-white rounded hover:bg-slate-700 transition" target="blank" href={mapLink}>Open Google Maps Route (CLICK)</a>
                        </div>
                        
                      </div>
                  </div> 
                : null}
              </div>
               {/* form buttons */}
               

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
