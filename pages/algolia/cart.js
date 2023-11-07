import { useState, useEffect } from 'react';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  function handleRemoveItem(id) {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    const newItems = items.filter((item) => item.id !== id);
    localStorage.setItem('cartItems', JSON.stringify(newItems));
    setCartItems(newItems);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {cartItems.length === 0 && (
        <p>Your cart is empty.</p>
      )}
      {cartItems.length > 0 && (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p className="text-gray-500">{item.quantity} x ${item.price}</p>
              </div>
              <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 font-bold">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CartPage;