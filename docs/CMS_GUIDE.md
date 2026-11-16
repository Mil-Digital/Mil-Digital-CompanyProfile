# Panduan CMS MIL Digital

Panduan singkat untuk tim yang mengelola konten di `/admin` (lokal: `http://localhost:3000/admin`, live: `https://mildigital-company-profile.vercel.app/admin`).

## Menu dan siapa yang melihatnya

| Grup | Isi | Role |
|---|---|---|
| **Website** | Homepage: hero, angka, karya unggulan, galeri, report unggulan | Admin, Editor |
| **Portfolio** | Case studies, Clients (logo), Testimonials | Admin, Editor |
| **Insights** | Articles, Reports | Admin, Editor |
| **Careers** | Jobs (lowongan), Applications (lamaran) | Admin, HR |
| **Leads** | Semua brief, quiz, download report, waitlist ATLAS | Admin, Sales |
| **Library** | Media (foto, logo, video, PDF) | Admin, Editor |
| **Administration** | Users | Admin |

Menu samping berupa deretan ikon dan terbuka saat kursor diarahkan ke sana; tombol pin di kartu logo membuatnya tetap terbuka. Setiap orang hanya melihat menu yang bisa ia kerjakan. Akun sendiri (nama, password) diubah lewat ikon profil di kanan atas. Hak akses dicek di server, bukan hanya disembunyikan di tampilan.

## Draft dan publish

- **Articles, Case studies, dan Reports** punya draft. Tekan **Save draft** untuk menyimpan tanpa menayangkan; hanya tim yang bisa melihat draft. Tekan **Publish** untuk menayangkan; halaman website diperbarui dalam hitungan detik.
- Untuk menurunkan konten dari website, buka dokumennya, klik menu **⋮**, lalu **Unpublish**. **Delete** menghapus permanen.
- Saat publish, field wajib (bertanda \*) harus lengkap. Kalau ada yang kurang, Payload menandai tab dan field-nya.
- Tanggal terbit terisi otomatis saat pertama kali publish; boleh diubah di sidebar.
- **Homepage, Clients, Testimonials, dan Jobs** tidak punya draft: tombol **Save** langsung mengubah website. Untuk menyembunyikan tanpa menghapus: Testimonials → hapus centang *Show on website*; Clients → hapus centang *Show in the logo strip*; Jobs → ubah *Status* ke **Closed**.
- Case study yang tampil di homepage dipilih di **Website → Homepage → Featured** (bisa diurutkan dengan drag). Kalau kosong, homepage menampilkan case study terbaru.

## Mengedit homepage

- **Website → Homepage** punya satu tab per section, urut dari atas ke bawah halaman: Hero, Journey film, About, Clients, Selected works, Services, Why MIL, Numbers, Team, Testimonials, Insights, Contact.
- Teks setiap section (label kecil, judul, paragraf, tautan, poin logo, janji A.C.T.I.V.E.) bisa diubah. Field berisi teks yang sekarang tampil; field yang dikosongkan kembali ke teks bawaan.
- Daftar yang punya menu sendiri (logo klien, case study, testimonial, artikel) diedit di menunya; tab terkait punya tombol yang membukanya di tab baru.
- Belum dari CMS: tiga panel layanan, daftar tim beserta fotonya, dan halaman selain homepage (About, Our Services, Our Team, Contact, dll.).

## Live preview

- Homepage, Case studies, Articles, Reports, Jobs, Testimonials, dan Clients membuka **live preview** di sebelah form: halaman website asli (font, ukuran, warna, animasi) yang berubah saat Anda mengetik, sebelum disimpan.
- Pilih ukuran layar **Desktop / Tablet / Mobile** di toolbar preview, atau buka di jendela terpisah. Tombol mata/preview di kanan atas menyembunyikan atau menampilkan panel.
- **Klik untuk edit:** arahkan kursor ke sebuah section di preview, lalu tekan tombol biru **Edit …**. Form langsung pindah ke tab section itu dan menyorotnya. Berlaku untuk Homepage, Case studies, Articles, dan Reports.
- Tampilan bawaan preview (**Responsive**) menunjukkan satu layar desktop 1440 × 900 yang diperkecil utuh; pilih Tablet atau Mobile di toolbar untuk ukuran lain.
- Label di pojok kiri bawah preview menunjukkan **Live preview** (tersambung) dan status **Draft/Published**.
- Dokumen baru menampilkan preview setelah disimpan pertama kali (Save draft).
- Preview hanya terbuka untuk orang yang login ke CMS, karena bisa menampilkan draft. Mengetik di form tidak mengubah website; perubahan baru tayang setelah **Publish/Save**.

## Leads dan lamaran

- **Leads** masuk otomatis dari form website. Ubah **Follow-up status** di sidebar (New → Contacted → Qualified → Won/Lost) dan tulis catatan di **Internal notes**. Gunakan kolom pencarian (nama, email, telepon, brand) dan tombol **Filters** (mis. status = New).
- **Applications** masuk dari halaman Career. Data kandidat dikunci; ubah **Stage** dan **Internal notes** saja.
- Kotak di dashboard menunjukkan jumlah lead dan lamaran yang masih **New**.

## Gambar dan file

- Foto: landscape, minimal 1600 px, idealnya di bawah 1 MB. Isi **Description (alt text)**, lalu klik bagian penting foto untuk mengatur titik fokus agar tidak terpotong.
- Logo klien: putih di atas latar transparan (PNG/SVG).
- Report: file PDF di tab **Download**. Semua isi Media bersifat publik, jadi jangan unggah dokumen rahasia.
- Hero homepage: **Background image** + **Cut-out** dari gambar yang sama (PNG/WebP transparan, ukuran sama, hanya orangnya). Kalau cut-out kosong, website memakai ilustrasi studio bawaan.

## Catatan teknis (untuk developer)

- Skema: `src/collections`, `src/globals`, `src/payload.config.ts`. Komponen admin: `src/components/admin`. Data untuk halaman: `src/lib/cms.ts` (query) dan `src/lib/cms-map.ts` (pemetaan, dipakai juga oleh live preview). Tampilan halaman: `src/components/views`; live preview: `src/components/preview` dan rute `src/app/(frontend)/preview`.
- Database Neon dipakai bersama oleh lokal dan live. `npm run dev` menerapkan perubahan skema (push) ke database itu; jalankan `npm run db:push` di terminal agar peringatan kehilangan data bisa dibaca sebelum disetujui.
- Perubahan November 2026: draft untuk Case studies dan Reports (tabel `_case_studies_v`, `_reports_v`, kolom `_status`), kolom `show_on_website` di Testimonials, field `foregroundImage` di Homepage. Dokumen lama diterbitkan dengan `npx payload run src/seed/publish-existing.ts` (aman dijalankan ulang).
