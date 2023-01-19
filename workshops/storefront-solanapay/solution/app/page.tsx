"use client" // this makes next know that this page should be rendered in the client
import { useState } from "react"
import Image from 'next/image'

export default function Home() {
  const [pizzaAddons, setPizzaAddons] = useState(
    [
      {
        name: "Pepperoni",
        amount: 0,

      },
      {
        name: "Mushrooms",
        amount: 0,
      },
      {
        name: "Olives",
        amount: 0,
      }
  ]
  )

  const addonPricings = {
    Pepperoni: 0.5,
    Mushrooms: 0.25,
    Olives: 0.25
  }

 const [ total, setTotal ] = useState(0)



  const addAddon = (addonName:string) => {
    // when this function is called, add 1 to the amount of the addon that was clicked and update the total
    const newPizzaAddons = pizzaAddons.map((addon) => {
      if (addon.name === addonName) {
        addon.amount += 1
      }
      return addon
    }
    )
    setPizzaAddons(newPizzaAddons)
    setTotal(total + addonPricings[addonName])

  }

  return (
    // a main component for a pizza shop with a funny and playful background design in tailwindcss
    <main className="min-h-screen bg-red-500 p-2">
        <h1 className="text-4xl font-bold text-center">Pizza Shop</h1>
        <div className="flex flex-col md:flex-row justify-center">
          <div className="w-full md:w-1/2">
            <div className="bg-white shadow-md rounded-2xl my-6 mr-2 overflow-hidden">
              <Image width={1000} height={1000} className="w-full" src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" alt="Pizza" />
              <div className="text-center px-3 pb-6 pt-2">
                <h1 className="text-xl font-bold">Pizza</h1>
                <p className="text-sm text-gray-600">A delicious pizza with the following ingredients:</p>
                <ul className="text-sm text-gray-600">
                  {pizzaAddons.map((addon) => (
                    <li key={addon.name}>{addon.name} x {addon.amount}</li>
                  ))}
                </ul>
                <h2>Total amount : {total}€</h2>
                <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full my-3">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="bg-white shadow-md rounded-2xl my-6 ml-2">
              <div className="text-center px-3 pb-6 pt-2">
                <h1 className="text-xl font-bold">Addons</h1>
                <p className="text-sm text-gray-600">Add some extra ingredients to your pizza:</p>
                <ul className="text-sm text-gray-600">
                  {pizzaAddons.map((addon) => (
                    <li key={addon.name}>
                      <button className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full my-3" onClick={() => addAddon(addon.name)}>
                        {addon.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      
    </main>
  

  )
}
