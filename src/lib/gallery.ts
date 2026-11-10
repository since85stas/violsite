// Фото галереи: свои из src/assets/gallery/ (Astro сжимает и делает WebP),
// в режиме разработки без своих — демо-фото с Unsplash.
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import gallery from '../data/gallery.json';
import { demoGallery, unsplashUrl, unsplashSrcset } from './demo-photos';
import type { Localized } from '../i18n/ui';

export type GalleryCategory = 'concert' | 'lessons' | 'portrait';

export interface GalleryPhoto {
  category: GalleryCategory;
  size: '' | 'tall' | 'wide';
  caption: Localized;
  meta: Localized;
  thumb: string;
  thumbSrcset: string;
  full: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/gallery/*.{jpg,jpeg,png,webp}', { eager: true });
const byName = new Map(Object.entries(files).map(([path, mod]) => [path.split('/').pop()!, mod.default]));

/** Есть ли что показать в галерее (для пункта меню). */
export const hasGalleryPhotos = () =>
  gallery.items.some((g) => g.file && byName.has(g.file)) || demoGallery.length > 0;

export async function loadGallery(): Promise<GalleryPhoto[]> {
  const own = gallery.items.filter((g) => g.file && byName.has(g.file));

  if (own.length > 0) {
    return Promise.all(
      own.map(async (g) => {
        const src = byName.get(g.file)!;
        const thumb = await getImage({ src, widths: [400, 600, 900], format: 'webp' });
        const full = await getImage({ src, width: Math.min(src.width, 1800), format: 'webp' });
        return {
          category: g.category as GalleryCategory,
          size: g.size as GalleryPhoto['size'],
          caption: g.caption,
          meta: g.meta,
          thumb: thumb.src,
          thumbSrcset: thumb.srcSet.attribute,
          full: full.src,
        };
      }),
    );
  }

  return demoGallery.map((g) => ({
    category: g.category as GalleryCategory,
    size: g.size as GalleryPhoto['size'],
    caption: g.caption,
    meta: g.meta,
    thumb: unsplashUrl(g.id, 600),
    thumbSrcset: unsplashSrcset(g.id, [400, 600, 900]),
    full: unsplashUrl(g.id, 1800),
  }));
}
