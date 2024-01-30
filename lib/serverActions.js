"use server"
import { cache } from 'react'

import algoliasearch from "algoliasearch";
import { createNullCache } from '@algolia/cache-common';


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
export const getProductInfo = cache(async (productId) => {
  return await cacheableGetProductInfo(productId);
});


/**
 * Cacheable callback using 3rd party API
 * @param {*} productId
 * @returns
 */
async function cacheableGetProductInfo(productId) {
  const product = await index.getObject(productId);
  return product;
}