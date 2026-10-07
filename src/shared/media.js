import { decodeEntities } from '@wordpress/html-entities';
export const keys = { 'carousel-gallery': 'gallery', 'image-carousel': 'carItems', 'lightbox-gallery': 'galItems', 'masonry-gallery': 'gallery' };
export const titles = { 'carousel-gallery': 'Carousel Gallery', 'image-carousel': 'Image Carousel', 'lightbox-gallery': 'Lightbox Gallery', 'masonry-gallery': 'Masonry Gallery' };
export function plainText(value = '') { return decodeEntities(String(value).replace(/<[^>]*>/g, '').trim()); }
export function normalizeMedia(items = []) {
 return items.filter(item => item && item.url).map(item => ({ id: item.id, url: item.url, alt: item.alt || '', caption: plainText(item.caption?.raw ?? item.caption?.rendered ?? item.caption), width: item.width, height: item.height }));
}
export function dimensions(kind, a) {
 if (kind === 'carousel-gallery') return [a.carouselWidth, a.carouselHeight];
 if (kind === 'image-carousel') return [a.carWidth, a.carHeight];
 return [a.mainImgWd, a.mainImgHt];
}

// Preserve gallery-specific text when the media modal returns library metadata.
export function mergeMedia(existing, selected, append = false) {
 const identity = item => item.id ? `id:${item.id}` : `url:${item.url}`;
 const previous = new Map(existing.map(item => [identity(item), item]));
 const incoming = normalizeMedia(Array.isArray(selected) ? selected : selected ? [selected] : []);
 const result = append ? [...existing] : [];
 const seen = new Set(result.map(identity));
 incoming.forEach(item => {
  const key = identity(item);
  if (seen.has(key)) return;
  const saved = previous.get(key);
  result.push(saved ? { ...item, alt: saved.alt ?? item.alt, caption: saved.caption ?? item.caption } : item);
  seen.add(key);
 });
 return result;
}
