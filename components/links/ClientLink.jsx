import React, { useEffect, useRef } from 'react';
import singletonRouter from 'next/router';

function ClientLink({children, href}) {
  const router = singletonRouter;
  const linkRef = useRef(null); // Create a ref for the button

  useEffect(() => {
    // Define the click event handler
    const handleClick = (e) => {
      e.preventDefault();
      router.push(href)
    };

    // Access the button element using the ref and add the event listener
    const buttonElement = linkRef.current;
    if (buttonElement) {
      buttonElement.addEventListener('click', handleClick);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('click', handleClick);
      }
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  return (
    <a href={href} ref={linkRef}>
      {children}
    </a>
  )
}

export default ClientLink;