import { assets } from "@/content/assets";

export type Asset = { src: string; width?: number; height?: number };

/*
  content/assets.ts là file tự sinh, và khi brand/ còn trống thì các nhóm là
  object rỗng — TypeScript suy ra khoá kiểu `never`, nên tra thẳng vào nó sẽ
  không biên dịch được. Ba hàm dưới đây nhận một tên bất kỳ và trả về null nếu
  không có, để khung nền chạy được cả khi chưa có asset nào.
*/
function lookup(group: Record<string, Asset>, name: string | null | undefined): Asset | null {
  if (!name) return null;
  return group[name] ?? null;
}

/**
 * Ảnh nền của section. Nhận cả tên trong brand/backgrounds lẫn đường dẫn
 * "/..." trỏ thẳng vào public (ảnh của chính cặp đôi).
 */
export function background(name: string | null | undefined): Asset | null {
  if (!name) return null;
  if (name.startsWith("/")) return { src: name };
  return lookup(assets.backgrounds as Record<string, Asset>, name);
}

export function texture(name: string | null | undefined): Asset | null {
  return lookup(assets.textures as Record<string, Asset>, name);
}

export function divider(name: string | null | undefined): Asset | null {
  return lookup(assets.dividers as Record<string, Asset>, name);
}

export function element(name: string | null | undefined): Asset | null {
  return lookup(assets.elements as Record<string, Asset>, name);
}
