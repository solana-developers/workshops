"use client" // this makes next know that this page should be rendered in the client
import { useRef, useState } from "react"
import PayQR from "@/src/components/PayQR"


type AddonItem = { name: string, price: number, amount: number }

export default function Home() {

  const ref = useRef<HTMLDivElement>(null);

  const [pizzaAddons, setPizzaAddons] = useState<AddonItem[]>(
    [
      { name: "Pepperoni", price: 0.5, amount: 0 },
      { name: "Mushrooms", price: 0.25, amount: 0 },
      { name: "Olives", price: 0.25, amount: 0 },
    ]
  )
  const [ total, setTotal ] = useState(0)

  const addAddon = (addonToAdd: AddonItem) => {
    const newPizzaAddons = pizzaAddons.map((addon) => {
      if (addon.name === addonToAdd.name) {
        addon.amount += 1
      }
      return addon
    })
    setPizzaAddons(newPizzaAddons)
    setTotal(total + addonToAdd.price)
  }

  const subtractAddon = (addonToAdd: AddonItem) => {
    let minZeroFlag = false;
    const newPizzaAddons = pizzaAddons.map((addon) => {
      if (addon.name === addonToAdd.name) {
        if (addon.amount === 0) {
          minZeroFlag = true
        } else {
          addon.amount -= 1
        }
      }
      return addon
    })
    if (!minZeroFlag) {
      setPizzaAddons(newPizzaAddons)
      setTotal(total - addonToAdd.price)
    }
  }

  return (
    <main className="min-h-screen bg-red-500 p-2">
      <div className="w-full">
        <div className="flex flex-col justify-center">
        
          {/* Header */}
          <div className="bg-gray-300 border-l-black mx-auto w-fit p-4 rounded-xl text-center">
            <h1 className="text-4xl text-center m-auto font-light">Valentin&apos;s Pizza Shop</h1>
          </div>

          {/* Order Builder */}
          <div className="bg-white shadow-md rounded-2xl my-6 mx-auto w-96">
            <div className="text-center px-3 pb-6 pt-2">
              {/* <h1 className="text-xl font-bold">Pizza</h1> */}
              <p className="text-sm text-gray-700 my-4">One delicious pizza with the following ingredients:</p>
              <ul className="text-sm text-gray-600">
                {pizzaAddons.map((addon) => {
                  return (
                    <li 
                      className="my-2 flex flex-row justify-left mx-10 text-lg"
                      key={addon.name}
                    >
                      <p className="font-bold">{addon.name}</p>
                      <p className="font-bold ml-auto text-red-600">{addon.amount}</p>
                      <button className="ml-6" onClick={() => addAddon(addon)}><span>+</span></button>
                      <button className="ml-4 mr-4" onClick={() => subtractAddon(addon)}><span>-</span></button>
                    </li>
                  )
                })}
              </ul>
              <h2 className="my-8 text-2xl">Order Total : <span className="front-heavy text-blue-600">{total}€</span></h2>
            </div> 
          </div>

          {/* Pay QR */}
          { total != 0 && (
            <PayQR />
          )}
        </div>
      </div>
    </main>
  )
}