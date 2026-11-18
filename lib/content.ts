import * as base from "@/content/client";
import type { Lang } from "@/content/client";
import { de } from "@/content/locales/de";
import { vi } from "@/content/locales/vi";

export type { Lang } from "@/content/client";

/**
 * Nội dung của site theo ngôn ngữ.
 *
 * content/client.ts là bản tiếng Anh và là bản gốc. Mỗi bản dịch ở
 * content/locales/ chỉ khai những chữ khác bản gốc; cái gì không khai thì giữ
 * nguyên tiếng Anh (ảnh, mã màu, link, toạ độ hoạ tiết...).
 *
 * Mảng trộn THEO VỊ TRÍ: phần tử thứ n của bản dịch đè lên phần tử thứ n của
 * bản gốc, nên bản dịch phải giữ đúng thứ tự và số phần tử của bản gốc.
 */
const source = {
  couple: base.couple,
  families: base.families,
  ceremony: base.ceremony,
  venue: base.venue,
  calendar: base.calendar,
  intro: base.intro,
  cover: base.cover,
  hero: base.hero,
  loveStory: base.loveStory,
  gallery: base.gallery,
  weddingInfo: base.weddingInfo,
  timeScene: base.timeScene,
  venueScene: base.venueScene,
  visa: base.visa,
  travel: base.travel,
  agenda: base.agenda,
  dresscode: base.dresscode,
  rsvp: base.rsvp,
  gifts: base.gifts,
  thankYou: base.thankYou,
  meta: base.meta,
};

export type Content = typeof source;

type DeepPartial<T> = T extends string | number | boolean | null | undefined
  ? T extends string
    ? string
    : T
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : { [K in keyof T]?: DeepPartial<T[K]> };

/** Kiểu của một bản dịch: cùng hình với bản gốc, mọi chỗ đều tuỳ chọn. */
export type Translation = DeepPartial<Content>;

const translations: Record<Exclude<Lang, "en">, Translation> = { vi, de };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function merge<T>(target: T, over: unknown): T {
  if (over === undefined) return target;
  if (Array.isArray(target) && Array.isArray(over)) {
    return target.map((item, i) => merge(item, over[i])) as T;
  }
  if (isObject(target) && isObject(over)) {
    const out: Record<string, unknown> = { ...target };
    for (const key of Object.keys(over)) out[key] = merge(target[key], over[key]);
    return out as T;
  }
  return over as T;
}

const cache = new Map<Lang, Content>();

export function content(lang: Lang): Content {
  const hit = cache.get(lang);
  if (hit) return hit;
  const value = lang === "en" ? source : merge(source, translations[lang]);
  cache.set(lang, value);
  return value;
}
