import { getProductInfo } from "../../../lib/serverActions";

export async function GET() {
  return Response.json({ message: 'Hello World!' });
}

/***
 * Using uncached by default.
 */
export async function POST(req) {
  const data = await req.json();
  // This is cached by objectId
  const product = await getProductInfo(data.objectId);
  console.log('product', product)
  return Response.json(product);
}
