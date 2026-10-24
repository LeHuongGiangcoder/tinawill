import { ceremony, couple, venue } from "@/content/client";

/** Google Calendar muốn dạng YYYYMMDDTHHMMSSZ (UTC). */
function stamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Link "Thêm vào lịch" — mở sẵn form tạo sự kiện của Google Calendar. */
export function googleCalendarUrl(): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Lễ cưới ${couple.groom} & ${couple.bride}`,
    dates: `${stamp(ceremony.startISO)}/${stamp(ceremony.endISO)}`,
    details: `${venue.name} — ${venue.hall}`,
    location: `${venue.name}, ${venue.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
