"use server"
import algoliasearch from "algoliasearch";
import { createNullCache } from '@algolia/cache-common';
import { unstable_cache } from 'next/cache';


// Algolia Credentials
const appId = 'SGF0RZXAXL';
const apiKey = '92a97e0f8732e61569c6aa4c2b383308';
// Initializing Search Client
const searchClient = algoliasearch(appId, apiKey, {
  responsesCache: createNullCache(),
  requestsCache: createNullCache()
});
const indexName = "prod_ECOM";
const index = searchClient.initIndex(indexName);


/**
 * Fetching data on the Server with third-party libraries
 */
export const getProductInfo = unstable_cache(
  async (productId) => cacheableProductInfo(productId),
  undefined,
  { tags: ['product_id'], revalidate: 60 }
);


/**
 * Cacheable callback using 3rd party API
 * @param {*} productId
 * @returns
 */
async function cacheableProductInfo(productId) {
  const product = await index.getObject(productId);
  console.log('>>>> fetching PD2', productId)
  return product;
}