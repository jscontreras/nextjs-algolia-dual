// Closure check for lamnda state
let warmCheck = null;

/**
 * Parameter query refers to the dynamic query attribute
 * getServerSideProps({query})
 * @param query
 */
export function checkWarmInvariantPagesRouter(query) {
  const jsonStr = JSON.stringify(query);
  if (jsonStr.includes("--warming-call--")) {
    return true;
  }
  return false;
}

/**
 * Paramter params refer to the dynamic params attribute
 * export default Page({params})
 * more info https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes#example
 * @param params
 */
export function checkWarmInvariantAppRouter({ params }) {
  const jsonStr = JSON.stringify(params);
  if (jsonStr.includes("--warming-call--")) {
    return true;
  }
  return false;
}

/**
 * Dtermines fn reuse via closure.
 * @returns
 */
export function fnWarmStatus() {
  if (warmCheck === null) {
    warmCheck = "OK";
    return "###COLD###";
  } else {
    return "###WARM###";
  }
}