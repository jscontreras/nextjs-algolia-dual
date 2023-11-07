import { useState, useEffect } from 'react';

function CartIcon() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [2];
    setCartItems(items);
  }, []);

  return (
    <div className="absolute right-5 top-3">
      <div className='relative w-10'>
        <svg width="1.5em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.1 12.6a2 2 0 0 0 2 1.4h10a2 2 0 0 0 2-1.4L23 6H6"></path>
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{cartItems.length}</span>
        )}
      </div>
    </div>
  );
}

export default CartIcon;