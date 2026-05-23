/**
 * Adds a subtle watermark + optimization to any Cloudinary URL
 * Text: "© Rolf Etter" — bottom right, small, semi-transparent
 */
export function cloudinaryUrl(url: string, opts?: { w?: number; watermark?: boolean }): string {
  if (!url || !url.includes('res.cloudinary.com')) return url;

  const { w, watermark = true } = opts || {};

  const transforms: string[] = ['f_auto', 'q_auto'];
  if (w) transforms.push(`w_${w}`);

  if (watermark) {
    // l_text: font, size, text | co: color | o: opacity | g: gravity | x/y: position
    transforms.push(
      'l_text:Cormorant Garamond_18_italic:©%20Rolf%20Etter',
      'co_rgb:ffffff',
      'o_45',
      'g_south_east',
      'x_16',
      'y_14',
      'fl_layer_apply'
    );
  }

  return url.replace('/image/upload/', `/image/upload/${transforms.join(',')}/`);
}
