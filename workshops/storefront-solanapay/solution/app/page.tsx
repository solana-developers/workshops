'use client'; // this makes next know that this page should be rendered in the client
import { useEffect, useState } from 'react';
import PayQR from '@/src/components/PayQR';
import { Keypair, PublicKey } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { PizzaOrder, displayOnChainPizzaOrder } from '@/src/util/order';
import { CONNECTION } from '@/src/util/const';


type PizzaOrderType = {
  pepperoni: number,
  mushrooms: number,
  olives: number,
}

export default function Home() {
  const [pizzaOrder, setPizzaOrder] = useState<PizzaOrderType>()
  const [total, setTotal] = useState(0);
  const [reference, setReference] = useState<PublicKey>();
  const [orderNumber, setOrderNumber] = useState<number>();

  const [orderPublicKey, setOrderPublicKey] = useState<PublicKey>();
  // const [onChainOrderDetails, setOnChainOrderDetails] = useState<PizzaOrder>();
  const [onChainOrderDetails, setOnChainOrderDetails] = useState<boolean>(false);

  const addAddon = (addon: PizzaOrderType) => {
    if (pizzaOrder) {
      setPizzaOrder(addon)
      setTotal(total + 0.5)
    }
  };

  const subtractPepperoni = () => {
    if (pizzaOrder && pizzaOrder.pepperoni != 0) { 
      setPizzaOrder({ ...pizzaOrder, pepperoni: pizzaOrder.pepperoni -= 1})
      setTotal(total - 0.5)
    }
  };
  const subtractMushrooms = () => {
    if (pizzaOrder && pizzaOrder.pepperoni != 0) { 
      setPizzaOrder({ ...pizzaOrder, mushrooms: pizzaOrder.mushrooms -= 1})
      setTotal(total - 0.5)
    }
  };
  const subtractOlives = () => {
    if (pizzaOrder && pizzaOrder.pepperoni != 0) { 
      setPizzaOrder({ ...pizzaOrder, olives: pizzaOrder.olives -= 1})
      setTotal(total - 0.5)
    }
  };


  useEffect(() => {
    setReference(Keypair.generate().publicKey);
    const randomOrderNumber = Math.floor(Math.random() * 255);
    setOrderNumber(randomOrderNumber);
    setPizzaOrder(new PizzaOrder({
      order: randomOrderNumber,
      pepperoni: 0,
      mushrooms: 0,
      olives: 0,
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Check if there is any transaction for the reference
        if (reference) {
          const signatureInfo = await findReference(CONNECTION, reference);
          // do something here when the transaction is confirmed
          console.log('Transaction confirmed', signatureInfo);
          // setOnChainOrderDetails(await displayOnChainPizzaOrder(CONNECTION, orderPublicKey))
          setOnChainOrderDetails(true)
        }
      } catch (e) {
        if (e instanceof FindReferenceError) {
          console.log('No transaction found for the reference');
          return;
        }
        console.error('Unknown error', e);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [orderPublicKey, reference]);

  return (
    <main className='min-h-screen bg-red-500 p-2'>
      { pizzaOrder && <div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-[url('../public/pizzeria.jpg')]">
        <div className="w-full min-h-screen bg-no-repeat bg-cover bg-center bg-fixed bg-red-900 bg-opacity-60 pt-4">
          {onChainOrderDetails ? 

            <div className='bg-white shadow-md rounded-2xl border-solid border border-black mx-auto w-fit p-2'>
              <div className='text-center px-3 pb-6 pt-2'>
                <h2 className='my-8 text-2xl'>
                  Confirmed!{' '}
                </h2>
                <p className='text-sm text-gray-700 my-4'>
                  Your Order :
                </p>
                <div className='text-center mx-auto w-96'>
                  <ul className='text-sm text-gray-600'>
                    <li
                      className='my-2 flex flex-row justify-center mx-16 text-lg'
                    >
                      <p className='font-bold'>Pepperoni</p>
                      <p className='font-bold ml-auto text-red-600'>{pizzaOrder.pepperoni}</p>
                    </li>
                    <li
                      className='my-2 flex flex-row justify-left mx-16 text-lg'
                    >
                      <p className='font-bold'>Mushrooms</p>
                      <p className='font-bold ml-auto text-red-600'>{pizzaOrder.mushrooms}</p>
                    </li>
                    <li
                      className='my-2 flex flex-row justify-left mx-16 text-lg'
                    >
                      <p className='font-bold'>Olives</p>
                      <p className='font-bold ml-auto text-red-600'>{pizzaOrder.olives}</p>
                    </li>
                  </ul>
                </div>
                <p className='text-sm text-gray-700 mt-6 mx-auto'>
                  On-Chain Address :
                </p>
                <p className='text-sm mt-2 mx-auto'>
                  Fv11UeEBGd2PgMV87rm8Ugx9mMBA71vVYwdcXEGSH3jP
                </p>
              </div>
            </div>
            :
            <div className='flex flex-col justify-center'>

              {/* Order Builder */}
              <div className='bg-white shadow-md rounded-2xl border-solid border border-black mx-auto w-fit p-2 mb-2'>
                <div className='text-center px-3 pb-6 pt-2'>
                  <p className='text-sm text-gray-700 my-4'>
                    One delicious pizza with the following ingredients:
                  </p>
                  <ul className='text-sm text-gray-600'>
                    <li className='my-2 flex flex-row justify-left mx-10 text-lg'>
                      <p className='font-bold'>Pepperoni</p>
                      <p className='font-bold ml-auto text-red-600'>{pizzaOrder.pepperoni}</p>
                      <button className='ml-6' onClick={() => addAddon({ ...pizzaOrder, pepperoni: pizzaOrder.pepperoni += 1})}><span>+</span></button>
                      <button
                        className='ml-4 mr-4'
                        onClick={() => subtractPepperoni()}><span>-</span></button>
                    </li>
                    <li className='my-2 flex flex-row justify-left mx-10 text-lg'>
                      <p className='font-bold'>Mushrooms</p>
                      <p className='font-bold ml-auto text-red-600'>{pizzaOrder?.mushrooms}</p>
                      <button className='ml-6' onClick={() => addAddon({ ...pizzaOrder, mushrooms: pizzaOrder.mushrooms += 1})}><span>+</span></button>
                      <button
                        className='ml-4 mr-4'
                        onClick={() => subtractMushrooms()}><span>-</span></button>
                    </li>
                    <li className='my-2 flex flex-row justify-left mx-10 text-lg'>
                      <p className='font-bold'>Olives</p>
                      <p className='font-bold ml-auto text-red-600'>{pizzaOrder?.olives}</p>
                      <button className='ml-6' onClick={() => addAddon({ ...pizzaOrder, olives: pizzaOrder.olives += 1})}><span>+</span></button>
                      <button
                        className='ml-4 mr-4'
                        onClick={() => subtractOlives()}><span>-</span></button>
                    </li>
                  </ul>
                  <h2 className='mt-8 text-2xl'>
                    Order Total :{' '}
                    <span className='front-heavy text-blue-600'>{total}€</span>
                  </h2>
                </div>
              </div>

              {/* Pay QR */}
              {total != 0 && reference && orderNumber && pizzaOrder && (
                <PayQR 
                reference={reference} 
                total={total}
                order={orderNumber}
                pepperoni={pizzaOrder.pepperoni}
                mushrooms={pizzaOrder.mushrooms}
                olives={pizzaOrder.olives}
              />
              )}
            </div>
          }
        </div>
      </div>}
    </main>
  );
}
