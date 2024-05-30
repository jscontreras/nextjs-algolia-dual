import singletonRouter from 'next/router';

// https://nextjs.org/docs/pages/api-reference/functions/use-router


function ActiveLink({ children, href }) {
  const router = singletonRouter;
  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick}>
      {children}
    </a>
  )
}

export default ActiveLink