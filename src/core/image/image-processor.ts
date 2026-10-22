export interface ProcessedImage {
  blob: Blob
  thumbnailBlob: Blob
  width: number
  height: number
  size: number
}

const MAX_DIMENSION = 1050
const JPEG_QUALITY = 0.8
const THUMBNAIL_SIZE = 200

function resizeToCanvas(
  img: ImageBitmap,
  maxSize: number,
): { canvas: OffscreenCanvas; width: number; height: number } {
  let { width, height } = img
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height)
    width = Math.round(width * ratio)
    height = Math.round(height * ratio)
  }
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  return { canvas, width, height }
}

export async function processImage(file: File | Blob): Promise<ProcessedImage> {
  const img = await createImageBitmap(file)

  const { canvas: mainCanvas, width, height } = resizeToCanvas(img, MAX_DIMENSION)
  const mainBlob = await mainCanvas.convertToBlob({ type: 'image/jpeg', quality: JPEG_QUALITY })

  const { canvas: thumbCanvas } = resizeToCanvas(img, THUMBNAIL_SIZE)
  const thumbnailBlob = await thumbCanvas.convertToBlob({ type: 'image/jpeg', quality: 0.7 })

  img.close()

  return {
    blob: mainBlob,
    thumbnailBlob,
    width,
    height,
    size: mainBlob.size,
  }
}
