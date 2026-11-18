import { content, type Lang } from "@/lib/content";

/** Google Calendar muốn dạng YYYYMMDDTHHMMSSZ (UTC). */
function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Link "Thêm vào lịch" — mở sẵn form tạo sự kiện của Google Calendar. Tên sự
 * kiện theo ngôn ngữ khách đang xem (`calendar.title` trong content).
 */
export function googleCalendarUrl(lang: Lang): string {
  const { calendar, ceremony, venue } = content(lang);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendar.title,
    dates: `${stamp(ceremony.startISO)}/${stamp(ceremony.endISO)}`,
    details: `${venue.name} — ${venue.hall}`,
    location: `${venue.name}, ${venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
