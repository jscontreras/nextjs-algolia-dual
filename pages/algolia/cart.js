import { useState, useEffect } from 'react';
import { refreshGlobalCart } from '../../lib/common';
import singletonRouter from 'next/router';
import { insightsClient, searchConfig } from '../../lib/algoliaConfig';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState('Your cart is empty.');

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  function handleRemoveItem(id) {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const newItems = items.filter((item) => item.objectID !== id);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    setCartItems(newItems);
    refreshGlobalCart();
  }

  return (
    <div className='p-4'>
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {cartItems.length === 0 && (
        <>
          <p>{cartMessage}</p>
          <div>
            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
              singletonRouter.push('/');
            }}> Go Back to Homepage </button>
          </div>
        </>
      )}
      {cartItems.length > 0 && (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.objectID} className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p className="text-gray-500">{item.quantity} x ${item.price.value}</p>
                </div>
                <button onClick={() => handleRemoveItem(item.objectID)} className="text-red-500 font-bold">Remove</button>
              </li>
            ))}
          </ul>
          <div className='flex justify-center	'>
            <button className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
              // Send add order completed event.
              insightsClient('purchasedObjectIDs', {
                // (OPTIONAL) authenticatedUserToken
                eventName: 'Purchased Objects',
                index: searchConfig.recordsIndex,
                objectIDs: cartItems.map((item) => {
                  return item.objectID
                }),
                objectData: cartItems.map((item) => {
                  return {
                    price: item.price.value * item.quantity,
                    quantity: item.quantity,
                    // OPTIONALdiscount: 0,
                  }
                }),
                currency: 'USD'
              });

              localStorage.setItem('cartItems', '[]');
              setCartItems([]);
              setCartMessage('Order Fulfilled Successfully!!!');
              refreshGlobalCart();
            }}> Complete Order </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;