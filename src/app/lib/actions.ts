'use server'

import { z } from 'zod'
import { RouteOptimizationClient } from '@googlemaps/routeoptimization'
import { RoutesClient } from '@googlemaps/routing'
// import { redirect } from 'next/navigation'

const routeoptimizationClient = new RouteOptimizationClient();
const routingClient = new RoutesClient();


export async function handleForm(prevState: any, customers: any, formData: FormData) {
    // const rawFormData = formData.getAll('driver-name')

    // const DriverData = ({
    //     driverName: formData.get('driver-name'),
    //     driverEmail: formData.get('driver-email'),
    //     startLocation: formData.get('driver-start'),
    //     endLocation: formData.get('driver-end')
    // });

    // console.log("Driver Data", DriverData)
    console.log("Customers:", customers)
    console.log("formData:", formData)

    try {
        console.log("hello api", formData)
        return { message: 'hello from api'}
    } catch (error){
      console.log(error)
      return {message: 'Database Error: Failed to Delete Invoice'}
    }
  }

  export async function callOptimizeTours() {
    const response = await routeoptimizationClient.optimizeTours({
      "parent": "projects/dna-tours-436623",
      "populatePolylines": true,
      "populateTransitionPolylines": true,
      "model": {
        "shipments": [
            {
              "deliveries": [
                {
                  "arrivalLocation": {
                    "latitude": 37.789456,
                    "longitude": -122.390192
                  },
                }
              ],
              "pickups": [
                {
                  "arrivalLocation": {
                    "latitude": 37.794465,
                    "longitude": -122.394839
                  },
                }
              ]
            },
            {
              "deliveries": [
                {
                  "arrivalLocation": {
                    "latitude": 37.789116,
                    "longitude": -122.395080
                  },
                }
              ],
              "pickups": [
                {
                  "arrivalLocation": {
                    "latitude": 37.794465,
                    "longitude": -122.394839
                  },
                }
              ]
            },
            {
              "deliveries": [
                {
                  "arrivalLocation": {
                    "latitude": 37.795242,
                    "longitude": -122.399347
                  },
                }
              ],
              "pickups": [
                {
                  "arrivalLocation": {
                    "latitude": 37.794465,
                    "longitude": -122.394839
                  },
                }
              ]
            }
          ],
        "vehicles": [
          {
            "endLocation": {
              "latitude": 37.794465,
              "longitude": -122.394839
            },
            "startLocation": {
              "latitude": 37.794465,
              "longitude": -122.394839
            },
            "costPerKilometer": 10.0,
            "costPerHour": 40.0
          }
        ]
      }
    });
    console.log(JSON.stringify(response));
    return(response)
  }




  export async function getRoute() {

  let origin = {
    "address": "1600 Amphitheatre Parkway, Mountain View, CA"
  }

  let destination = {
    "address": "450 Serra Mall, Stanford, CA 94305, USA"
  }

    // Construct request
  const request = {
    origin,
    destination,
  };

  // Run request
  const response = await routingClient.computeRoutes( {
    origin: {
      address: "111 Silverdale Road, Silverdale, Hamilton 3216",
    },
    destination: {
      address: "37 Fitzroy Avenue, Fitzroy, Hamilton 3206",
    },
    intermediates: [
      {address: "319 Grey Street, Hamilton East, Hamilton 3216"},
      {address: "32A Thackeray Street, Hamilton Lake, Hamilton 3204"},
      {address: "90 Masters Avenue, Hillcrest, Hamilton 3216"},
    ],
    optimizeWaypointOrder: true,
  },
  {
    otherArgs: {
      headers: {
        "X-Goog-FieldMask": "routes,",
      },
    },
  }
);
  console.log(response);
  return(response)
}