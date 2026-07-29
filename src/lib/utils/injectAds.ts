import { VideoItem, AdItem } from '@/types';
import { AD_ITEMS } from '@/constants';

export function injectAds(items: VideoItem[]): Array<VideoItem | AdItem> {
  const result: Array<VideoItem | AdItem> = [];
  items.forEach((item, i) => {
    result.push(item);
    if ((i + 1) % 8 === 0 && AD_ITEMS[(i / 8) | 0]) {
      result.push(AD_ITEMS[(i / 8) | 0]);
    }
  });
  return result;
}
