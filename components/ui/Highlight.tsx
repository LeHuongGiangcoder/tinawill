import { Fragment } from "react";

/**
 * In một đoạn văn với vài cụm chữ khoá được quét highlight (`.highlight` trong
 * app/globals.css). Cụm nào cần nhấn thì khai ở content/client.ts, đoạn văn
 * vẫn là một chuỗi thường — không phải chèn thẻ vào nội dung.
 *
 * So khớp không phân biệt hoa thường; cụm không có trong đoạn thì bị bỏ qua.
 */
export function Highlighted({ text, words }: { text: string; words: readonly string[] }) {
  const escaped = words.filter(Boolean).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (escaped.length === 0) return <>{text}</>;

  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "i"));
  const isWord = (part: string) => words.some((w) => w.toLowerCase() === part.toLowerCase());

  return (
    <>
      {parts.map((part, i) =>
        isWord(part) ? (
          <mark key={i} className="highlight">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
