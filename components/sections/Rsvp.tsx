"use client";

import { useState, type FormEvent } from "react";

import Image from "next/image";

import { useGuest } from "@/components/experience/GuestProvider";
import { Button } from "@/components/ui/Button";
import { Caption, Heading, Script, SectionHead } from "@/components/ui/Heading";
import { Choice, Field, FieldLabel } from "@/components/ui/Field";
import { Reveal } from "@/components/ui/Reveal";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { rsvp } from "@/content/client";
import { background as resolveBackground } from "@/lib/assets";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Form RSVP.
 *
 * Dữ liệu đi thẳng tới Glow RSVP Hub theo đúng hợp đồng trong skill glow-rsvp:
 *
 *   • POST, Content-Type `text/plain;charset=utf-8` — để Apps Script không
 *     dính CORS preflight (nó không trả lời được preflight).
 *   • Body là MỘT object phẳng: `client` + đúng các field của form.
 *   • Không gửi key rỗng và không gửi state của giao diện (status, step…).
 *
 * Thêm hay đổi tên field ở đây thì phải chạy lại:
 *   ~/glow-tools/glow-rsvp.sh fields <client> --fields "key=Nhãn;…"
 *
 * Khách bấm "Regretfully declines" thì mấy câu hỏi phòng ốc, ngày ở thêm và ăn
 * uống tự ẩn — hỏi tiếp người không đến là vô nghĩa.
 */
export function Rsvp() {
  const sheet = resolveBackground("paper-beige");
  const { guest } = useGuest();
  const [status, setStatus] = useState<Status>("idle");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [companion, setCompanion] = useState(rsvp.fields.companion.options[0]);
  const [hasDietary, setHasDietary] = useState(false);

  const personalized = rsvp.mode === "personalized";
  const fields = rsvp.fields;
  const going = attending === "yes";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    // Thứ tự các key ở đây chính là thứ tự cột trong Sheet của khách.
    const values: Record<string, string> = {
      name: guest?.name ?? String(data.get("name") ?? "").trim(),
      attending,
      companion: going ? companion : "",
      roomSharing: going ? String(data.get("roomSharing") ?? "").trim() : "",
      extendStay: going ? String(data.get("extendStay") ?? "").trim() : "",
      dietary: going
        ? hasDietary
          ? fields.dietary.yes
          : fields.dietary.none
        : "",
      dietaryDetails:
        going && hasDietary
          ? String(data.get("dietaryDetails") ?? "").trim()
          : "",
    };

    // Khách vào bằng link mời riêng: gửi kèm slug để hub ghi đúng dòng của họ.
    if (personalized && guest?.slug) values.slug = guest.slug;

    // Không gửi key rỗng — cột trống trong Sheet là rác.
    for (const [key, value] of Object.entries(values)) {
      if (value === "") delete values[key];
    }

    setStatus("sending");

    if (!rsvp.endpoint || !rsvp.client) {
      // Chưa chạy skill glow-rsvp. Vẫn cho khách thấy màn cảm ơn khi dựng thử.
      console.info("[rsvp] chưa nối hub, dữ liệu sẽ gửi:", values);
      setStatus("sent");
      return;
    }

    try {
      const res = await fetch(rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ client: rsvp.client, ...values }),
      });
      const payload = (await res.json()) as { ok?: boolean };
      setStatus(payload?.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <SectionWrapper section="rsvp" width="prose" labelledBy="rsvp-title">
      {/*
        Nền section là dải sọc đỏ–kem, quá rộn để đặt chữ thẳng lên; cả form
        nằm trên một tờ giấy beige có đường sóng cam viền quanh.

        `data-tone` lật cả bảng màu cho cụm này, nên ô nhập, nút bấm và chữ
        phụ bên trong tự lấy mực trên giấy beige thay vì chữ kem trên sọc đỏ —
        không phải truyền prop xuống từng cái.
      */}
      <div data-tone="beige" className="sheet frame-wave">
        {/* Mặt giấy cắt tới đúng tim đường sóng, nên ngoài nét sóng là dải
            sọc chứ không phải một vành giấy thừa — xem `.frame-wave-fill`
            trong app/globals.css. */}
        <span aria-hidden className="frame-wave-fill">
          {sheet ? (
            <Image
              src={sheet.src}
              alt=""
              fill
              sizes="(max-width: 48rem) 100vw, 40rem"
              className="object-cover"
            />
          ) : null}
        </span>

        <SectionHead
          eyebrow={rsvp.eyebrow}
          title={
            personalized && guest
              ? `${rsvp.greeting} ${guest.name}`
              : rsvp.title
          }
          titleId="rsvp-title"
          subtitle={rsvp.subtitle}
          intro={rsvp.note}
        />

        <Reveal>
          {status === "sent" ? (
            <div
              role="status"
              className="flex flex-col items-center gap-stack text-center"
            >
              <Heading level="h3">{rsvp.successTitle}</Heading>
              <Script>{rsvp.successNote}</Script>
              <Button variant="outline" onClick={() => setStatus("idle")}>
                Change my answer
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-block">
              {/* Khách đã có tên trong Sheet thì khỏi hỏi lại */}
              {personalized && guest ? null : (
                <Field label={fields.name.label} htmlFor="rsvp-name">
                  <input
                    id="rsvp-name"
                    name="name"
                    required
                    autoComplete="name"
                    maxLength={80}
                    placeholder={fields.name.placeholder}
                    className="field-input"
                  />
                </Field>
              )}

              <fieldset className="flex flex-col gap-tight">
                <FieldLabel as="legend">{fields.attending.label}</FieldLabel>
                <Choice
                  name="attending"
                  value="yes"
                  checked={going}
                  onChange={() => setAttending("yes")}
                >
                  {fields.attending.yes}
                </Choice>
                <Choice
                  name="attending"
                  value="no"
                  checked={!going}
                  onChange={() => setAttending("no")}
                >
                  {fields.attending.no}
                </Choice>
              </fieldset>

              {going ? (
                <>
                  <fieldset className="flex flex-col gap-tight">
                    <FieldLabel as="legend">
                      {fields.companion.label}
                    </FieldLabel>
                    {fields.companion.options.map((option) => (
                      <Choice
                        key={option}
                        name="companion"
                        value={option}
                        checked={companion === option}
                        onChange={() => setCompanion(option)}
                      >
                        {option}
                      </Choice>
                    ))}
                  </fieldset>

                  <Field label={fields.roomSharing.label} htmlFor="rsvp-room">
                    <input
                      id="rsvp-room"
                      name="roomSharing"
                      maxLength={200}
                      placeholder={fields.roomSharing.placeholder}
                      className="field-input"
                    />
                  </Field>

                  <Field label={fields.extendStay.label} htmlFor="rsvp-stay">
                    <input
                      id="rsvp-stay"
                      name="extendStay"
                      maxLength={200}
                      placeholder={fields.extendStay.placeholder}
                      className="field-input"
                    />
                  </Field>

                  <fieldset className="flex flex-col gap-tight">
                    <FieldLabel as="legend">{fields.dietary.label}</FieldLabel>
                    <Choice
                      name="dietary"
                      value="none"
                      checked={!hasDietary}
                      onChange={() => setHasDietary(false)}
                    >
                      {fields.dietary.none}
                    </Choice>
                    <Choice
                      name="dietary"
                      value="yes"
                      checked={hasDietary}
                      onChange={() => setHasDietary(true)}
                    >
                      {fields.dietary.yes}
                    </Choice>
                    {hasDietary ? (
                      <textarea
                        name="dietaryDetails"
                        aria-label={fields.dietary.yes}
                        maxLength={400}
                        placeholder={fields.dietary.placeholder}
                        className="field-input mt-tight"
                      />
                    ) : null}
                  </fieldset>
                </>
              ) : (
                <Script className="text-center">{rsvp.declineNote}</Script>
              )}

              <div className="flex flex-col items-center gap-stack">
                <Button type="submit" disabled={status === "sending"}>
                  {status === "sending" ? rsvp.sending : rsvp.submit}
                </Button>
                <Caption>{rsvp.deadline}</Caption>
                {status === "error" ? (
                  <p role="alert" className="text-small text-tone-accent">
                    {rsvp.errorNote}
                  </p>
                ) : null}
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </SectionWrapper>
  );
}
