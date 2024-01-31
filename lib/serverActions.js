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
 * Using unstable_cache for optimizing callbacks
 * @param {} productId
 * @returns
 */
export async function getProductInfo(productId) {
  const getProductInfUC = unstable_cache(
    async (productId) => cacheableProductInfo(productId),
    [`p_${productId}`],
    { tags: [`p_${productId}`], revalidate: 60 }
  );
  return getProductInfUC(productId);
}

/**
 * Cacheable callback using 3rd party API
 * @param {*} productId
 * @returns
 */
async function cacheableProductInfo(productId) {
  console.log('>>>> fetching PD2', `**${productId}**`);
  await new Promise(r => setTimeout(r, 100));
  const product = await index.getObject(productId);
  console.log('product', product);
  return product;
}