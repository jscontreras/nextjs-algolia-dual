export const fetchCache = 'auto'

import { getProductInfo } from "../../../lib/serverActions";

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const objectId = searchParams.get('objectId');
  try {
    const product = await getProductInfo(objectId);
    return Response.json(product)
  } catch (er) {
    console.error(er);
    const product = await getProductInfo("M0E20000000E2QT");
    return Response.json(product)
  }
}

