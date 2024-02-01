import Image from 'next/image';

import sharp from 'sharp';

function ImageProcessing({ image }) {

  const processedImage = sharp(image)
    .resize(500, 500)
    .jpeg()
    .toBuffer();

  return <Image src={processedImage} />;

}

export default function SharpTest() {
  return <ImageProcessing image={'./vercel_logo.jpg'} />
}