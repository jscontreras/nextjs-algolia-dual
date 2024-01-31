export const fetchCache = 'auto'

import { getProductInfo } from "../../../lib/serverActions";

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const objectId = searchParams.get('objectId');
  const product = await getProductInfo(objectId ? objectId : "M0E20000000E2QT");
  return Response.json(product);
}

