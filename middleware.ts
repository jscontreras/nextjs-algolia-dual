import { NextRequest, NextResponse } from "next/server";
import { geolocation, ipAddress } from '@vercel/edge';


export function middleware(request: NextRequest) {
  const reqPath = request.nextUrl.pathname;
  if (reqPath.startsWith('/catalog')) {

    const host = process.env.PROXY_HOST;

    const { country, region, city } = geolocation(request);
    const ip = ipAddress(request);
    let p = request.nextUrl.pathname.replace('/catalog', '/algolia/c');
    let newUrl = new URL(p, request.url);
    if (host && !host.includes(request.nextUrl.host)) {
      newUrl = new URL(`${host}${p}`);
      const response = NextResponse.rewrite(newUrl);
      // add random header
      response.headers.set('X-hello', 'world');

      // Forwarding context from Original Request. (catalog/men/shoes/exception)
      if (country && region && city && ip && !reqPath.startsWith(`/catalog/men/shoes`)) {
        response.headers.set('X-Forwarded-Geo-Country', country);
        response.headers.set('X-Forwarded-Geo-Region', region);
        response.headers.set('X-Forwarded-Geo-City', city);
        response.headers.set('X-Vercel-Forwarded-For', ip); // or 'X-Vercel-Forwarded-For'
      }
      return response;
    }
  }
}