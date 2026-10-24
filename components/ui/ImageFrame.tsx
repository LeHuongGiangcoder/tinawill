import Image from "next/image";

/**
 * Khung ảnh dùng chung: nền giấy, bóng nhẹ, bo góc theo token.
 *
 * `ratio` là tỉ lệ ô ảnh; ảnh bên trong luôn object-cover nên ảnh khách gửi
 * tỉ lệ nào cũng không bị méo. `tilt` nghiêng nhẹ cho cảm giác ảnh in dán tay.
 */
export function ImageFrame({
  src,
  alt,
  ratio = "3 / 4",
  tilt = 0,
  priority = false,
  sizes = "(max-width: 48rem) 80vw, 24rem",
  className = "",
}: {
  src: string;
  alt: string;
  ratio?: string;
  tilt?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-paper bg-surface p-tight shadow-paper ${className}`}
      style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
    >
      <div className="relative w-full overflow-hidden rounded-paper" style={{ aspectRatio: ratio }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}
