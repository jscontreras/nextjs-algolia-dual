// Getting Dependencies from window
import aa from 'search-insights';
import algoliasearch from 'algoliasearch/lite';
import PubSub from "pubsub-js";

const environment = process.env.NODE_ENV || false;
// Algolia Credentials
const appId = 'SGF0RZXAXL';
const apiKey = '92a97e0f8732e61569c6aa4c2b383308';

// Sent Payloads
const sentPayloads = new Set();

// Initializing Search Client
const clientBase = algoliasearch(appId, apiKey);
export const searchClient = { ...clientBase, ...clientProxy(clientBase) };

// Insights Analytics Client Initialization
if (typeof window !== "undefined") {
  let userToken = getCookie('_ALGOLIA');
  // Set token for both Authenticated or unauthenticated users.
  if (userToken) {
    aa("init", { appId, apiKey, useCookie: true, userToken });
  } else {
    aa("init", { appId, apiKey, useCookie: true });
  }
}

// Insights Client
export const insightsClient = aa;

// Insights Object Configuration for InstnatSearch
export const insightsConfig = {
  insightsClient: aa,
  onEvent: (event, aa) => {
    const { insightsMethod, payload, widgetType, eventType } = event;
    // Convert the payload object to a string for Set comparison
    const payloadString = JSON.stringify(payload);

    // Send the event to Algolia if it hasn't been sent before
    if (insightsMethod && !sentPayloads.has(payloadString)) {
      aa(insightsMethod, payload);
      sentPayloads.add(payloadString);
    }
  }
};

// Configure your indices here
export const searchConfig = preProcessConfig({
  catalogId: "products",
  catalogLabel: "All Products",
  recordsIndex: "prod_ECOM",
  nonResultsIndex: "prod_ECOM",
  querySuggestionsIndex: "prod_ECOM_query_suggestions",
  sortByIndices: [
    { label: 'Featured', value: 'prod_ECOM' },
    { label: 'Price (asc)', value: 'prod_ECOM_price_asc' },
    { label: 'Price (desc)', value: 'prod_ECOM_price_desc' }
  ],
  // The URL used for the search results page.
  searchPagePath: "/algolia/search",
  productPdpPathPrefix: '/algolia/pdp',
  categoryPlpPathPrefix: '/algolia/c',
  autocompleteTags: {
    recordsSearch: ['autocomplete-search'],
    nonResults: ['autocomplete-non-results'],
  },
  instantSearchTags: {
    recordsSearch: ['ais-results-page', 'test-facets-sort'],
    nonResults: ['ais-non-results-page', 'test-facets-sort'],
  },
  attributeLabels: {
    'price.value': 'Price',
    'hierarchical_categories': "Catalog",
    'color.original_name': 'Colors',
    'price.on_sales': 'Promos',
    'reviews.rating': 'Avg. Customer Review',
    'available_sizes': 'Sizes'
  }
});

// Export channel subscription
export const pubsub = PubSub;
// Constant for Events pub-sub
export const QUERY_UPDATE_EVT = "QUERY_UPDATE_EVT";

/**
 * Advance Algolia client config overrider.
 * @param {*} clientBase
 * @returns
 */
function clientProxy(clientBase) {
  return {
    search(requests) {
      const refinedRequests = requests.map(request => {
        // Get the non-results query from instant search and remove the instantSearch inherited tags
        if (request.indexName == searchConfig.noResultsIndex && request.params && request.params.ruleContexts) {
          const isNonResultsTagged = request.params.ruleContexts.find(context => searchConfig.instantSearchTags.nonResults.includes(context));
          if (isNonResultsTagged) {
            request.params.ruleContexts = request.params.ruleContexts.filter(context => {
              return !searchConfig.instantSearchTags.recordsSearch.includes(context);
            })
          }
        }
        return request;
      })
      return clientBase.search(refinedRequests);
    }
  };
}

/**
 * Configure overrides.
 * Used in this case to inject catalog page filter
 */
export function overrideConfig(initialConfig) {
  const currentPath = window.location.pathname;
  // Detecting Catalog Page
  if (currentPath.startsWith('/catalog/')) {
    // Simple parser for example purposes
    const pathSections = currentPath.split('/')
    const category = (pathSections[2].charAt(0).toUpperCase() + pathSections[2].slice(1)).split('.')[0];
    initialConfig['filters'] = initialConfig.filters ? `${initialConfig.filters} AND category_page_id:'${category}'` : `category_page_id:'${category}'`;
  }
  return initialConfig;
}

/**
 * Controls configuration for local development ease
 * @param {} config
 */
function preProcessConfig(config) {
  if (environment === 'development') {
    return {
      ...config,
    }
  }
  return config;
}

/**
 * Returns friendly name if available in the config
 * @param {} attribute
 * @returns
 */
export function friendlyAttributeName(attribute) {
  if (searchConfig.attributeLabels[attribute]) {
    return searchConfig.attributeLabels[attribute];
  } else if (attribute.includes('.lvl')) {
    const hierarchicalAttribute = attribute.split('.lvl')[0];
    return friendlyAttributeName(hierarchicalAttribute);
  }
  return attribute;
}

/**
 * Stores the query info for after search events
 * @param {*} object
 */
export function storeInfoForAfterEvents(object) {
  localStorage.setItem('lastAlgoliaQueyInfo', JSON.stringify(object));
}

/**
 * Stores the query info for after search events
 * @returns
 */
export function getInfoForAfterEvents() {
  return JSON.parse(localStorage.getItem('lastAlgoliaQueyInfo'));
}

/**
 * Returns cookie based on name
 * @param {} name
 * @returns null if not found, otherwise the cookie value
 */
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return null;
}

// Initialize indexDictionary
let indexDict = {};

// Calculate map for shortening URL
searchConfig.sortByIndices.forEach((indexName, i) => {
  indexDict[indexName.value] = `i${i}`;
});

// Variable for storing extra URL params
let extraUrlParams = {};

/**
 * Custom Router implementation
 * https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/react/#example-of-implementation
 */
export const routerOptions = {
  createURL({ qsModule, location, routeState }) {
    let paramsSize = 0;
    const { origin, pathname, hash, search } = location;
    // Calculate query String for Algolia UIState
    let queryString = qsModule.stringify(routeState);
    const searchParams = new URLSearchParams(search);
    paramsSize = searchParams.size;
    searchParams.forEach((value, key) => {
      const paramKey = key.split('[')[0];
      if (typeof indexDict[paramKey] === 'undefined') {
        extraUrlParams[key] = value;
      }
    });
    const suffix = Object.keys(extraUrlParams).length > 0 && queryString.length > 0 ? `&` : '';
    const extraParamsStr = Object.keys(extraUrlParams).length > 0 ? Object.keys(extraUrlParams).map(key => (`${key}=${extraUrlParams[key]}`)).join('&') + suffix : '';

    if (paramsSize === 0) {
      return `${origin}${pathname}`;
    }
    return `${origin}${pathname}?${extraParamsStr}${queryString}${hash}`;
  },
  parseURL({ qsModule, location }) {
    const { search } = location
    const routeState = qsModule.parse(location.search.slice(1));
    // Calculating and storing extra URL variables
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((value, key) => {
      const paramKey = key.split('[')[0];
      if (typeof indexDict[paramKey] === 'undefined') {
        extraUrlParams[key] = value;
      }
    });
    return routeState;
  },
}