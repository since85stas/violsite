// Видео с YouTube, Rutube и VK Видео.
// На странице сначала только обложка; плеер (iframe) подгружается по клику —
// так страница не тянет сторонние скрипты и куки, пока посетитель не нажал «смотреть».
//
// Для российской аудитории YouTube может не открываться без VPN — поэтому
// поддержаны Rutube и VK Видео: одно и то же видео можно разместить там.

import videos from '../data/videos.json';
import sample from '../data/videos.sample.json';
import type { Localized } from '../i18n/ui';

export type VideoProvider = 'youtube' | 'rutube' | 'vk';

export interface Video {
  provider: VideoProvider;
  id: string;
  poster: string;
  title: Localized;
  meta: Localized;
}

const own = (videos.items as Video[]).filter((v) => v.id);
/** Свои видео; в режиме разработки без своих — демо. */
export const allVideos: Video[] = own.length > 0 ? own : import.meta.env.DEV ? (sample.items as Video[]) : [];

export function embedUrl(v: Video): string {
  switch (v.provider) {
    case 'youtube':
      return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`;
    case 'rutube':
      return `https://rutube.ru/play/embed/${v.id}?autoplay=1`;
    case 'vk': {
      const [oid, id] = v.id.split('_');
      return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=1`;
    }
  }
}

export function watchUrl(v: Video): string {
  switch (v.provider) {
    case 'youtube': return `https://www.youtube.com/watch?v=${v.id}`;
    case 'rutube': return `https://rutube.ru/video/${v.id}/`;
    case 'vk': return `https://vk.com/video${v.id}`;
  }
}

/** Обложка: своя из public/ или превью площадки. Для VK без своей обложки — пусто (будет заглушка). */
export function posterUrl(v: Video): string {
  if (v.poster) return v.poster;
  switch (v.provider) {
    case 'youtube': return `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
    case 'rutube': return `https://rutube.ru/api/video/${v.id}/thumbnail/?redirect=1`;
    case 'vk': return '';
  }
}

export const providerName = (p: VideoProvider, lang: 'ru' | 'en') =>
  ({ youtube: 'YouTube', rutube: 'Rutube', vk: lang === 'ru' ? 'VK Видео' : 'VK Video' })[p];
