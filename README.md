# MIL Digital — Company Profile Website

Website company profile MIL Digital: tampilan high-end dengan animasi futuristik, konten dikelola lewat CMS, dan alur konversi (quiz, booking konsultasi, WhatsApp).

## Dokumentasi

- [Project Specification](docs/PROJECT_SPEC.md) — arah desain, sistem animasi, spesifikasi halaman, model CMS, tech stack, dan tahapan pengerjaan.
- [Brief sitemap & page inventory](docs/assets/sitemap-brief.png)
- [Design References](docs/DESIGN_REFERENCES.md) — referensi yang disukai/dihindari, cara memberi masukan style, usulan homepage v2.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Motion · Lenis · Payload CMS 3 · Neon Postgres · (rencana: Cal.com · Resend · Vercel)

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi DATABASE_URL (Neon) dan PAYLOAD_SECRET
npm run dev                  # website: http://localhost:3000
                             # CMS:     http://localhost:3000/admin
                             # restarts itself when the Payload schema changes
npm run build                # build produksi
```

## CMS (Payload)

- Buka `/admin`. Akun pertama otomatis menjadi **Admin**; akun berikutnya dibuat dari **Administration → Users** (role: Admin, Editor, HR, Sales).
- Panduan pemakaian untuk tim (menu, draft & publish, leads, gambar): **[docs/CMS_GUIDE.md](docs/CMS_GUIDE.md)**.
- Setiap kali konten disimpan atau dipublish, halaman terkait langsung diperbarui (cache di-expire otomatis).
- Media disimpan di Vercel Blob bila `BLOB_READ_WRITE_TOKEN` diisi; tanpa token, di folder lokal `media/`. `npm run media:push` menyalin isi `media/` ke Blob.
- `npm run generate:types` setelah mengubah skema; `npm run generate:importmap` setelah menambah komponen admin.
- `npm run dev` otomatis me-restart server saat `payload.config.ts`, `src/collections`, `src/globals` atau `src/payload` berubah. Hot reload Turbopack pada file-file itu membuat referensi editor Lexical basi (error "module factory is not available"); `npm run dev:raw` menjalankan next dev biasa.
- Database dipakai bersama oleh lokal dan live: perubahan skema langsung berlaku di database production. Jalankan `npm run db:push` dan baca peringatannya sebelum menyetujui.
- `npm run seed` hanya untuk database kosong (jangan di production).

## Struktur singkat

- `src/app/` — halaman (App Router). Homepage di `src/app/page.tsx`.
- `src/components/sections/` — section homepage (hero, works wheel, services, …).
- `src/components/motion/` — primitive animasi (`SectionEntrance`, `Reveal`, `SplitText`, `Odometer`, `Magnetic`).
- `src/components/ui/` — komponen UI (shadcn-style), termasuk `tilted-grid-hero` dan `image-gallery`.
- `src/collections/`, `src/globals/`, `src/payload.config.ts` — skema CMS. `src/lib/cms.ts` — pengambilan data untuk halaman.
- `src/content/` — konten awal (dipakai seed dan sebagai cadangan bila CMS kosong).
- `public/clients/`, `public/brand/` — logo klien & logo MIL (diolah dari `Assets/`).

## Status

Fase 3 — semua halaman di page inventory sudah dibangun dan terhubung ke CMS (konten sebagian masih placeholder). Berikutnya: konten asli, notifikasi lead, cloud storage, deploy.
