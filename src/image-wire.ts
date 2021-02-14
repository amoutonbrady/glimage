interface Options {
  /**
   * A number indicating the gap (in pixels) between each images.
   * The default value is '0' (no gaps).
   */
  gap: number;
  /**
   * A string indicating in which direction the image are going to be glued together.
   * The default direction is 'horizontal'.
   */
  direction: 'horizontal' | 'vertical';
  /**
   * A string indicating the image format.
   * The default format type is 'image/png'.
   */
  type: string & ('image/jpeg' | 'image/png' | 'image/webp');
  /**
   * A number between 0 and 1 indicating the image quality to use for image formats that use lossy compression such as image/jpeg and image/webp.
   * The default value is '0.92'.
   */
  quality: number;
  /**
   * A string, canvas gradient or canvas pattern used to fill the background.
   * There is no default.
   */
  color?: string | CanvasGradient | CanvasPattern;
}

const defaultOptions: Options = {
  gap: 0,
  direction: 'horizontal',
  type: 'image/png',
  quality: 0.92,
};

/**
 * image-wire takes a list of sources (URLs or FileList from an input[type="file"]) and glue them together to form a single image.
 *
 * @param sources {string[] | FileList} - List of images. Can be a list of URLs or a FileList from an input[type="file"]
 * @param options {Partial<Options>} - List of options
 *
 * @example
 * ```ts
 * import { image-wire } from 'image-wire';
 *
 * const img = document.querySelector('img');
 * const input = document.querySelector('input');
 *
 * input.addEventListener('change', async (e) => {
 *   const { files } = e.target as HTMLInputElement;
 *
 *   const [src, blob] = await image-wire(files, {
 *     direction: 'vertical',
 *     gap: 100,
 *     color: 'red',
 *   });
 *
 *   img.src = src;
 *
 *   uploadImage(blob);
 * });
 * ```
 */
export async function imageWire(
  sources: string[] | FileList,
  options?: Partial<Options>,
) {
  // Merge options
  const { direction, gap, color, type: format, quality } = {
    ...defaultOptions,
    ...options,
  };

  // Make sure all sources are links
  const src =
    sources instanceof FileList
      ? Array.from(sources).map(URL.createObjectURL)
      : sources;

  // Instanciate the canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Load sources of every sources url
  const images = src.map(
    (source) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onerror = () => rej(new Error("Couldn't load image"));
        img.onload = () => res(img);
        img.src = source;
      }),
  );

  // Make sure all source have resolved with success
  const resolvedImages = await Promise.all(images);

  // This will compute the dynamic side
  const computedSize = (property: 'width' | 'height', index: number) => {
    return resolvedImages
      .slice(0, index)
      .reduce((len, img, i) => len + img[property] + (i ? gap : 0), 0);
  };

  // This will compute the static side (essentially finding the biggest value)
  const staticSize = (property: 'width' | 'height') =>
    Math.max(...resolvedImages.map((img) => img[property]));

  // This will setup the canvas regarding of the direction
  if (direction === 'horizontal') {
    canvas.width = computedSize('width', resolvedImages.length);
    canvas.height = staticSize('height');
  } else {
    canvas.width = staticSize('width');
    canvas.height = computedSize('height', resolvedImages.length);
  }

  // This will add the background color if there's one defined
  if (color) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // This will compute the [x, y] value to place the image on the canvas
  const computeCoords = (i: number): [number, number] => {
    if (!i) return [0, 0];

    return direction === 'horizontal'
      ? [computedSize('width', i) + gap, 0]
      : [0, computedSize('height', i) + gap];
  };

  // Draw resolvedImages to canvas
  resolvedImages.forEach((img, i) => {
    const coords = computeCoords(i);
    ctx.drawImage(img, ...coords);
  });

  // Resolve all other data URIs sync
  return fetch(canvas.toDataURL(format, quality))
    .then((r) => r.blob())
    .then((blob) => [URL.createObjectURL(blob), blob] as const);
}
