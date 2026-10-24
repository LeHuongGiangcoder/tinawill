# glow-base

Khung nền cho site cưới Glow. Next.js 16 · React 19 · TypeScript · Tailwind v4 · GSAP.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

Làm site cho khách mới: sửa `content/client.ts`, `content/theme.ts`, thay ảnh
trong `public/images/`, thay nhạc `public/audio/music.mp3`. Nối RSVP bằng skill
`glow-rsvp`. Chi tiết ở [CLAUDE.md](CLAUDE.md).

Khách có design system riêng (vân giấy, hoạ tiết, dải ren)? Thả file vào
[`brand/`](brand/README.md), điền `brand/direction.md`, rồi:

```bash
npm run assets
```
