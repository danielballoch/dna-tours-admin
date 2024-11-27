import Image from "next/image";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Admin App | DNA New Zealand"
}

export default function Home() {
  return (
    <div className="bg-black text-white">
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
              <h2 className="text-xl my-4">Please Add Driver Details:</h2>
              <div className="flex">
                <div className="w-6/12">
                  <label for="driver-name">Name:</label><br/>
                  <input id="driver-name" name="driver-name" className="w-full text-black p-1" type="text"></input>
                </div>
                <div className=" w-6/12 ml-5">
                  <label >Email:</label><br/>
                  <input type="text" className="w-full text-black p-1" ></input>
                </div>
              </div>
              <div className="py-5">
                <label>Start Location: </label><br/>
                <input type="text" className="w-full text-black p-1"></input>
              </div>
              <div className="py-5">
                <label>End Location: </label><br/>
                <input type="text" className="w-full text-black p-1"></input>
              </div>

              <h2 className="text-xl my-4 mt-10">Please Add Customer Details:</h2>
              <div className="flex">
                <div className="w-6/12">
                  <label>Name:</label><br/>
                  <input className="w-full text-black p-1" type="text"></input>
                </div>
                <div className="w-6/12 ml-5">
                  <label >Email: </label><br/>
                  <input className="w-full text-black p-1" type="text"></input>
                </div>
              </div>
              <div className="py-5">
                <label>Pickup Location: </label><br/>
                <input className="w-full text-black p-1" type="text"></input>
              </div>
              <div className="flex">

              <button className="w-7/12 p-5 mt-5 bg-yellow-500">Generate Route/Pickup Times</button>
              <button className="w-4/12 p-5 mt-5 bg-sky-950 ml-auto">Add Customer</button>
              </div>
              
            </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a></a>
      </footer>
    </div>
  );
}
