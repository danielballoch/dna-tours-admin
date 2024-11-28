'use client'
import Image from "next/image";
import type { Metadata } from 'next'
import Head from 'next/head'
import { useState } from 'react'

// export const metadata: Metadata = {
//   title: "Admin App | DNA New Zealand"
// }

function Customer({i}){
  return(
    <div>hello {i}</div>
  )
}


export default function Home() {
  const [customers, updateCustomers] = useState([1])
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
            <form className="w-full mb-36">
              <h2 className="text-xl my-2">Please Add Driver Details:</h2>
              <div className="bg-white text-black mb-10 p-4 rounded">
                <div className="flex" >
                  <div className="w-6/12">
                    <label htmlFor="driver-name">Name:</label><br/>
                    <input id="driver-name" name="driver-name" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                  </div>
                  <div className=" w-6/12 ml-5">
                    <label >Email:</label><br/>
                    <input type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" ></input>
                  </div>
                </div>
                <div className="py-2">
                  <label>Start Location: </label><br/>
                  <input type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"></input>
                </div>
                <div className="py-2">
                  <label>End Location: </label><br/>
                  <input type="text" className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"></input>
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
                      <div className="w-4/12 pb-1">
                        <label>Name:</label><br/>
                        <input className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <div className="w-6/12 ml-5 pb-1">
                        <label >Email: </label><br/>
                        <input className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                      <div className="w-6/12 ml-5 pb-1">
                        <label>Pickup Location: </label><br/>
                        <input className="w-full text-black p-1 rounded outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600" type="text"></input>
                      </div>
                    </div>
                  
                  </div>
                )}
                <p>Total Customers: {customers.length}</p>
              </div>

              <div className="flex">
              <button className="w-8/12 p-5 mt-5 rounded bg-indigo-600">Generate Route/Pickup Times</button>
              <button type="button" onClick={() => updateCustomers([...customers, customers[customers.length - 1] + 1])} className="grow p-5 mt-5 ml-4 bg-white text-black rounded">Add Customer</button>
              </div>
              
              
            </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a></a>
      </footer>
    </div>
  );
}
