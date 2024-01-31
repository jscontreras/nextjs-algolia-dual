export const fetchCache = 'auto'

import { getProductInfo } from "../../../lib/serverActions";

export async function GET() {
  const product = await getProductInfo('M0E20000000EAAK');
  return Response.json({ message: 'Hello World!', product });
}

/***
 * Using uncached by default.
 */
export async function POST(req) {
  try {
    const data = await req.json();
    // This is cached by objectId
    const product = await getProductInfo(data.objectId);
    return Response.json(product);
  } catch (err) {
    console.error(err);
    const product = await getProductInfo('M0E20000000EAAK');
    return Response.json({ message: 'Hello World!', product });
  }
}
