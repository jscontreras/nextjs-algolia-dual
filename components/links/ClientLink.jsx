import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router'


function ClientLink({children, href}) {
  const router = useRouter();
  const buttonRef = useRef(null); // Create a ref for the button

  useEffect(() => {
    // Define the click event handler
    const handleClick = () => {
      router.push(href)
    };

    // Access the button element using the ref and add the event listener
    const buttonElement = buttonRef.current;
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
    <a href={href}>
      {children}
    </a>
  )
}

export default ClientLink;