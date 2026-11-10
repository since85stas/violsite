// Демо-фото с Unsplash для режима разработки. Грузятся браузером с CDN Unsplash,
// в проект не скачиваются и в сборку для сайта не попадают.
import demo from '../data/demo-photos.json';

export const DEMO_ENABLED = import.meta.env.DEV;

/** URL картинки Unsplash нужной ширины (их CDN сам режет и отдаёт WebP/AVIF). */
export const unsplashUrl = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&q=75&auto=format&fit=crop`;

export const unsplashSrcset = (id: string, widths: number[]) =>
  widths.map((w) => `${unsplashUrl(id, w)} ${w}w`).join(', ');

export const demoPortrait = DEMO_ENABLED ? demo.portrait : undefined;
export const demoGallery = DEMO_ENABLED ? demo.gallery : [];
