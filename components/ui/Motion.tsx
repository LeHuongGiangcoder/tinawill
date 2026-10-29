"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motion } from "@/content/theme";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cú cụng ly của trang Venue. Mỗi cánh tay nằm trong một lớp nguyên khung nên
 * dịch theo phần trăm của khung: hở giữa hai ly là 205px trong khung 1200px,
 * mỗi bên đi 8.6% (103px) là hai vành ly chạm nhau, kèm 1.6% chiều cao để hai
 * vành ngang nhau — ly trái vẽ cao hơn ly phải chừng một nhịp tay.
 */
const CLINK = { reach: 8.6, lift: 1.6, tilt: 1.6 };

/** Sự kiện phát ra khi khách bấm "Mở thiệp" — ExperienceProvider bắn ra. */
export const OPEN_EVENT = "glow:open";

/**
 * Toàn bộ chuyển động của trang, gom vào một chỗ:
 *
 *   [data-reveal]        hiện dần khi cuộn tới (một batch cho cả trang)
 *   [data-parallax="N"]  trôi chậm hơn trang N% khi cuộn
 *   [data-hero]          hiện khi thiệp được mở, không chờ cuộn
 *   [data-clink]         hai cánh tay trang Venue vươn vào cụng ly rồi thu về
 *
 * Section chỉ cần gắn attribute, không section nào tự gọi GSAP — nhờ vậy
 * chúng vẫn là server component và không có hai hệ animation chạy song song.
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Ai tắt hiệu ứng thì hiện hết ngay, không dựng trigger nào.
    if (reduce) {
      gsap.set("[data-reveal]", { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]:not([data-hero])", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          for (const node of batch as HTMLElement[]) {
            const delay = Number(node.dataset.revealDelay ?? 0) / 1000;
            gsap.fromTo(
              node,
              { opacity: 0, y: motion.revealDistance },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                delay,
                overwrite: "auto",
              },
            );
          }
        },
      });

      const arms = {
        left: document.querySelector<HTMLElement>('[data-clink="left"]'),
        right: document.querySelector<HTMLElement>('[data-clink="right"]'),
      };
      if (arms.left && arms.right) {
        /* Gốc xoay đặt ở mép ngoài, nơi vai nằm: tay nghiêng quanh vai chứ
           không quay quanh giữa khung. */
        gsap.set(arms.left, { transformOrigin: "0% 80%" });
        gsap.set(arms.right, { transformOrigin: "100% 85%" });

        const toast = gsap.timeline({ paused: true });
        // Vươn ra: hai tay đi vào nhau, ly chạm.
        toast.to(
          arms.left,
          { xPercent: CLINK.reach, yPercent: CLINK.lift, rotation: CLINK.tilt, duration: 0.9, ease: "power2.inOut" },
          0,
        );
        toast.to(
          arms.right,
          { xPercent: -CLINK.reach, yPercent: -CLINK.lift, rotation: -CLINK.tilt, duration: 0.9, ease: "power2.inOut" },
          0,
        );
        // Chạm: một cú nảy nhẹ — ly dội lại rồi chạm lần hai.
        toast.to(arms.left, { xPercent: CLINK.reach - 1.2, duration: 0.12, ease: "power1.out" }, 0.9);
        toast.to(arms.right, { xPercent: -(CLINK.reach - 1.2), duration: 0.12, ease: "power1.out" }, 0.9);
        toast.to(arms.left, { xPercent: CLINK.reach, duration: 0.1, ease: "power1.in" }, 1.02);
        toast.to(arms.right, { xPercent: -CLINK.reach, duration: 0.1, ease: "power1.in" }, 1.02);
        // Giữ một nhịp rồi thu về chỗ cũ.
        toast.to(
          [arms.left, arms.right],
          { xPercent: 0, yPercent: 0, rotation: 0, duration: 1, ease: "power2.inOut" },
          1.6,
        );

        ScrollTrigger.create({
          trigger: arms.left.closest("section") ?? arms.left,
          start: "top 45%",
          onEnter: () => void toast.restart(),
          onEnterBack: () => void toast.restart(),
        });
      }

      for (const node of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
        gsap.to(node, {
          yPercent: -Number(node.dataset.parallax),
          ease: "none",
          scrollTrigger: {
            trigger: node.closest("section") ?? node,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    /*
      Hero nằm ngay dưới màn mở thiệp nên không bao giờ "cuộn tới" — nó hiện
      theo chính cú chạm mở thiệp. Nếu trang không có màn mở thiệp thì
      ExperienceProvider bắn sự kiện này ngay khi mount.
    */
    const onOpen = () => {
      gsap.fromTo(
        "[data-hero]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          stagger: motion.revealStagger,
          /* Chờ màn lá của GardenStage rút ra hai mép rồi chữ mới hiện —
             "chữ hero xuất hiện khi vùng giữa đã thoáng". */
          delay: 1.2,
          overwrite: "auto",
        },
      );
      ScrollTrigger.refresh();
    };

    window.addEventListener(OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      ctx.revert();
    };
  }, []);

  return null;
}
