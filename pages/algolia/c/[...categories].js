import React from "react";
import crypto from 'crypto';
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import { InstantSearchResults } from "../../../components/algolia/InstantSearchResults";
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import { searchConfig } from "../../../lib/algoliaConfig";

/**
 * Main Page Prototype.
 * @returns
 */
export default function Category({ serverState, serverUrl, extraSearchParams, city, ip }) {
  const routing = {
    stateMapping: singleIndex(searchConfig.recordsIndex),
    router: createInstantSearchRouterNext({
      singletonRouter, serverUrl: serverUrl, routerOptions: {
        cleanUrlOnDispose: false
      }
    }),
  };

  return <div className="page_container">
    <InstantSearchSSRProvider {...serverState}>
      <header>
        <h2 className="category-title"> Category Page: {`[${extraSearchParams.filters}] `}</h2>
      </header>
      <InstantSearchResults
        routing={routing}
        extraSearchParams={extraSearchParams}
      />
    </InstantSearchSSRProvider>
    <p>City: {city} IP: {ip}</p>
  </div>
}

/**
 * SSR
 * @param {*} param0
 * @returns
 */
export async function getServerSideProps({ req, query, res, resolvedUrl }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;
  const { categories } = query;
  const categoryPageIdFilter = categories.map((str) => (str.charAt(0).toUpperCase() + str.slice(1))).join(" > ");
  const filters = `category_page_id:'${categoryPageIdFilter}'`;

  // Calculate user-token via server
  let clientUserToken = req.cookies._ALGOLIA || null;
  // Set cookie if not found
  if (clientUserToken === null) {
    clientUserToken = 's__' + crypto.randomUUID();
    res.setHeader('Set-Cookie', `_ALGOLIA=${clientUserToken}; Path=/;`)
  }

  const extraSearchParams = { filters: filters, userToken: clientUserToken };
  const serverState = await getServerState(<Category serverUrl={serverUrl} extraSearchParams={extraSearchParams} />, { renderToString });

  const headers = {};
  req.rawHeaders.forEach((header, index) => {
    if (index % 2 == 0) {
      if (header.startsWith('x') || header.startsWith('X'))
        headers[header] = req.rawHeaders[index + 1];
    }
  });
  console.log('headers', headers);
  return {
    props: {
      serverState,
      serverUrl,
      extraSearchParams,
      serverUrl,
      resolvedUrl,
      city: req.headers['x-vercel-ip-city'] || '???',
      ip: req.headers['x-real-ip'] || 'x.x.x.x',
    },
  };
}