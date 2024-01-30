import { NextRequest, NextResponse } from "next/server";

export function middleware(request) {
  const requestHeaders = new Headers(request.headers)
  const res = NextResponse.next()

  // retrieve the HTTP "Origin" header
  // from the incoming request
  const origin = requestHeaders.get("origin");
  // if the origin is an allowed one,
  // add it to the 'Access-Control-Allow-Origin' header
  if (!origin) {
    return NextResponse.json({ error: 'Unauthorized request' }, { status: 403 })
  }
  return res
}

// specify the path regex to apply the middleware to
export const config = {
  matcher: '/api/:path*',
}