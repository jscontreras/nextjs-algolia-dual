export const fetchCache = 'auto'

import { getProductInfo } from "../../../lib/serverActions";

/**
 * Get request (non-cached by default as it uses the request object)
 * @param {} request
 * @returns
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const objectId = searchParams.get('objectId');
  const product = await getProductInfo(objectId);
  return Response.json(product)
}

