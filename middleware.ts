import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/catalog')) {
    let p = request.nextUrl.pathname.replace('/catalog', '/algolia/c');
    const newUrl = new URL(p, request.url);
    return NextResponse.rewrite(newUrl);
  }
}