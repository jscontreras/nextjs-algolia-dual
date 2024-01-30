import { cache } from "react";
import { getProductInfo } from "../../../lib/serverActions";

export async function GET() {
  return Response.json({ message: 'Hello World!' });
}

const cachedFn = cache(getProductInfo);
/***
 * Using uncached by default.
 */
export async function POST(req) {
  const data = await req.json();
  // This is cached by objectId
  const product = await cachedFn(data.objectId);
  return Response.json(product);
}



export const revalidate = 3600 // revalidate the data at most every hour
