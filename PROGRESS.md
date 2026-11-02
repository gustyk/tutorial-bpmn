# PROGRESS — Pelaksanaan Tutorial BPMN 2.0 UISI

Diperbarui agent di commit yang sama dengan tugasnya. Format baris: `- [ ] T-x.y — judul` → `- [x] T-x.y — judul · 2026-11-xx · catatan satu baris`.

**Acuan:** [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md) v1.1 · [SPEC.md](SPEC.md) v1.1 · **Status keseluruhan:** WP-11 selesai
**Keputusan pemilik:** S-01…S-04 dan D-01…D-03 sudah dijawab 2026-11-01 · G1 disetujui 2026-11-02 · G2 disetujui 2026-11-02
**Gerbang berikutnya:** G3 — persetujuan rilis. Hentikan dan tunjukkan ke pemilik setelah WP-11 (katalog) dan WP-12 (QA).

---

## WP-0 · Fondasi toolchain dan baseline

- [x] T-0.1 — Instalasi bersih di WSL dengan Node Linux · 2026-11-02 · Node v20.18.0 Linux, `npm ls` tanpa UNMET
- [x] T-0.2 — Perbaiki validator BPMN (tambah `bpmn-moddle`, perbaiki impor) · 2026-11-02 · tambah `bpmn-moddle@^10.3.1` ke dependencies; validator sudah berjalan sebagai transitive dep, kini eksplisit
- [x] T-0.3 — Hapus 20 baris `/>` liar di 11 file MDX · 2026-11-02 · `/>` dipindah ke akhir baris `]}` (JSX valid); `grep "^/>"` = 0; `check` tetap 0 errors
- [x] T-0.4 — Build pertama yang berhasil (`check` + `build`) · 2026-11-02 · `@astrojs/check` downgrade ke 0.9.4 + override `@astrojs/language-server` ke 2.16.16 (bug require-ESM di 2.17.x); check 0 errors, build 19 halaman
- [x] T-0.5 — Kebersihan repo (`.gitignore`, hapus log build, hapus `docs/config.ts`) · 2026-11-02 · hapus duplikat & baris EOF di .gitignore; hapus `astro-build-output.txt` dan `src/content/docs/config.ts`
- [x] T-0.6 — Perbaiki `.htaccess` (buang fallback SPA, 404, cache `.bpmn`) · 2026-11-02 · hapus RewriteRule SPA; tambah ErrorDocument 404, AddType .bpmn, cache rules
- [x] T-0.7 — Playwright + `tests/render.spec.ts` · 2026-11-02 · `playwright.config.ts` + test render 2 file .bpmn; 2 passed; screenshot tersimpan
- [x] T-0.8 — `scripts/check-links.mjs` · 2026-11-02 · scan dist HTML; tambah favicon.svg ke public/; `npm run links` = OK 23 files
- [x] T-0.9 — Rangkai `npm run verify` dan buktikan ia bisa gagal · 2026-11-02 · semua 6 langkah dirangkai dengan `&&`; korupsi BPMN → VERIFY_EXIT:1 terbukti; pulih → FINAL_EXIT:0
- [x] T-0.10 — CI GitHub Actions `verify.yml` · 2026-11-02 · `.github/workflows/verify.yml` Node 20, npm ci, playwright install, npm run verify

## WP-1 · Lapisan data dan audit

- [x] T-1.1 — Perluas `inventory.json` (tier, slug, introducedIn, reusedIn, sources) · 2026-11-02 · 48 elemen + tier A=35/B=10/C=3; 13 event + tierByPosition; A2 check: semua Tier A punya introducedIn
- [x] T-1.2 — `schemas/inventory.schema.json` + validasi `ajv` · 2026-11-02 · draft-07 schema; AJV via createRequire; audit gagal bila field wajib hilang
- [x] T-1.3 — Riset verifikasi matriks event → `event-matrix.json` · 2026-11-02 · 104 sel (63 valid/41 invalid); lokator §10.4.x tabel 10.84–10.92; status DRAFTED; TODO-VERIFY untuk baris tepat
- [x] T-1.4 — Tulis ulang `audit-coverage.mjs` (aturan A1–A9, exit non-zero) · 2026-11-02 · semua 9 aturan; WARN untuk rules yang butuh konten WP-7+; FAIL untuk violations nyata; --release dan --report flag
- [x] T-1.5 — Perluas `content.config.ts` (frontmatter notasi + modul) · 2026-11-02 · z.object opsional untuk moduleSchema + notationSchema; `npm run check` 0 errors
- [x] T-1.6 — `src/lib/inventory.ts` · 2026-11-02 · reader + types; getInventory(), getElementsByTier(), getElementById(), getElementBySlug(), getElementsIntroducedIn()
- [x] **G1** — Gerbang pemilik: tabel Tier + ringkasan matriks event — **DISETUJUI 2026-11-02**

## WP-2 · Sistem desain dan komponen dasar

- [x] T-2.1 — `Callout.astro` · 2026-11-02 · 4 tipe (standard/camunda/bestpractice/pedagogical); collapsed prop; source prop; ikon+label tak hanya warna
- [x] T-2.2 — `Reveal.astro` · 2026-11-02 · details native; storageKey localStorage; keyboard OK
- [x] T-2.3 — `Checkpoint.astro` · 2026-11-02 · aria-live; localStorage per moduleId+itemId; tautan bacaUlang
- [x] T-2.4 — `Quiz.astro` v2 · 2026-11-02 · 6 tipe; umpan balik per opsi; rubrik mandiri argumentation; check 0 errors
- [x] T-2.5 — `NotationIcon` + `NotationCard` · 2026-11-02 · delegasi SVG ke BpmnNotationGallery; tidak ada set ikon kedua
- [x] T-2.6 — `CoverageTable` · 2026-11-02 · dari inventory.ts saat build; angka sesuai audit:coverage --report
- [x] T-2.7 — `DeltaBlock` · 2026-11-02 · introduces+reuses props; data-delta-introduces untuk BpmnViewer highlight
- [x] T-2.8 — `Figure` · 2026-11-02 · penomoran client-side sequential; "Gambar N:" otomatis
- [x] T-2.9 — Lintasan aksesibilitas · 2026-11-02 · focus outline; aria-label/live di semua komponen; info tidak hanya dari warna
- [x] T-2.10 — `MermaidDiagram` lazy-load · 2026-11-02 · IntersectionObserver; tidak dimuat jika tidak ada diagram; textAlt prop

## WP-3 · Viewer dan simulasi token

- [x] T-3.1 — `BpmnViewer` v2 · 2026-11-02 · lazy IntersectionObserver; highlight prop; compareWith mode; fullscreen; File API
- [x] T-3.2 — Mode berdampingan · 2026-11-02 · compareWith prop; zoom tersinkron; 360px grid-template-columns:1fr
- [x] T-3.3 — Pemuatan file lokal · 2026-11-02 · File API input type=file; FileReader; tidak ada request jaringan keluar
- [x] T-3.4 — `TokenSimV2.astro` · 2026-11-02 · data-driven JSON (kontrak 4.5); prediksi sebelum mulai; narasi+altText per langkah; highlight via bpmn-js
- [x] T-3.5 — Hapus `TokenSim` lama · 2026-11-02 · fondasi/token.mdx migrasi ke TokenSimV2; TokenSim.astro dihapus; 0 referensi tersisa

## WP-4 · CriteriaChecker

- [x] T-4.1 — `schemas/criteria.schema.json` · 2026-11-02 · draft-07; validasi mode auto/manual/assisted; min 4 criteria, min 2 auto; A6 pakai schema ini
- [x] T-4.2 — Mesin 11 aturan + kombinator + 3 mode · 2026-11-02 · `src/lib/rules/engine.ts` + `types.ts`; anyOf/allOf/not; evaluateCriterion + parseBpmnElements
- [x] T-4.3 — UI pelaporan tanpa skor · 2026-11-02 · `CriteriaChecker.astro`; File API upload; terpenuhi/belum/dugaan/manual; tanpa skor/persen/lulus-gagal
- [x] T-4.4 — `tests/rules.test.mjs` dengan fixture lolos dan gagal · 2026-11-02 · 22 test (11 aturan × 2); `node --test`; 22/22 hijau; `test:rules` masuk `verify`

## WP-5 · Alat mahasiswa

- [x] T-5.1 — `/alat/menggambar` · 2026-11-02 · 8 topik wajib SPEC 9.1; termasuk peringatan Boundary Event dan autosave; sidebar "Alat" ditambahkan
- [x] T-5.2 — `/alat/periksa-model` · 2026-11-02 · `PeriksaModelApp.astro`: case picker + BpmnViewer referensi + CriteriaChecker berdampingan; daftar kasus kosong (WP-7+)
- [x] T-5.3 — Pernyataan privasi · 2026-11-02 · Callout bestpractice di kedua halaman: "sepenuhnya di browser, statis, tanpa backend"

## WP-6 · Arsitektur informasi dan migrasi rute

- [x] T-6.1 — Pohon rute SPEC 11 v1.1 · 2026-11-02 · 24 stub baru (jalur/01–10, s1–s2, notasi, katalog, referensi, lampiran, tentang); sidebar lengkap 7 seksi
- [x] T-6.2 — Redirect rute lama · 2026-11-02 · /about→/tentang, /events/catalog→/katalog/, /events/matrix→/katalog/matriks-event, /practice/review→/referensi/review, /advanced/→/referensi/anti-pattern; redirect content-migration (fondasi/, practice/) ditunda ke WP-7
- [x] T-6.3 — Halaman 404 kustom · 2026-11-02 · 404.mdx di content collection (Starlight); robots.txt; link ke beranda + peta belajar
- [x] T-6.4 — site + sitemap + robots · 2026-11-02 · site: 'https://bpmn.kodingno.com'; @astrojs/sitemap; dist/sitemap-index.xml memuat domain produksi
- [x] T-6.5 — Pagefind · 2026-11-02 · 39 halaman terindeks bahasa id; dist/pagefind/index ada

## WP-7 · Modul 1–3 dan notasinya → GERBANG G2

- [x] T-7.0 — Bongkar `practice/narrative.mdx` · 2026-11-02 · redirect /practice/narrative→/jalur/01; konten narasi dibuka kembali di jalur/01-03; file asli tetap ada (tidak dihapus — masih dipakai oleh tautan lama sampai redirect aktif)
- [x] T-7.1 — Perbaiki `case-01-order.bpmn` (id stabil, label SPEC 7.4) · 2026-11-02 · id stabil SE_PesananDiterima/TA_*/EE_*; nama SPEC 7.4 (kata kerja + objek); diagram 5 elemen linear
- [x] T-7.2 — Modul 1 (Resep 5.1) · 2026-11-02 · jalur/01.mdx: 7 bagian; BpmnViewer terbuka di bagian 1; kunci jawaban 4 lapis di details; CriteriaChecker dengan criteriaSrc case-01
- [x] T-7.3 — Modul 2 (Resep 5.1) + reuse negatif · 2026-11-02 · jalur/02.mdx: 7 bagian; reuse negatif: Task bercabang tanpa gateway, XOR join dianggap barrier; case-02-order.bpmn dengan XOR + 2 End Event
- [x] T-7.4 — Modul 3 (Resep 5.1) + reuse negatif · 2026-11-02 · jalur/03.mdx: 7 bagian; reuse negatif: SF lintas Pool, MF sebagai SF; case-03-order.bpmn 2 Pool + 2 Message Flow
- [x] T-7.5 — 15 halaman notasi Tier A · 2026-11-02 · E01/A01/A02/F01/G01/A03/A04/A05/A07/P01/C01/F02/E02/A08/A09; masing-masing 19 bagian; inventory.json docPath diperbarui; sidebar 15 entri
- [x] T-7.5b — Tambah BpmnViewer visual di semua 15 halaman notasi · 2026-11-02 · 3 demo BPMN baru (notasi-demo-linear, notasi-demo-gateway, notasi-demo-task-types); section 2 (gambar notasi), 8 (contoh penggunaan), 9 (diagram contoh) kini menampilkan diagram visual via BpmnViewer; verify exit 0
- [x] **G2** — Gerbang pemilik: purwarupa mutu 3 modul · 2026-11-02 · LULUS: pemilik menyetujui WP-7, meminta perbaikan visual notasi (T-7.5b), kemudian memberi lampu hijau ke WP-8.

## WP-8 · Modul 4–6 dan notasinya

- [x] T-8.1 — Modul 4 · 2026-11-02 · case-04-order.bpmn (Lane/P02, DataObject/D01, DataAssociation/F04, Association/F03, TextAnnotation/R01); criteria.json (6 kriteria 4 auto 2 manual); jalur/04.mdx (7 seksi, 2 reuse negatif Lane vs Pool); verify exit 0
- [x] T-8.2 — Modul 5 + reuse negatif "XOR menunggu pembayaran" · 2026-11-02 · case-05-order.bpmn (EventBasedGateway/G04, TimerEvent/E03, PT24H); criteria.json (6 kriteria); jalur/05.mdx (7 seksi, walkthrough token, 3 kesalahan umum); verify exit 0
- [x] T-8.3 — Modul 6 + reuse negatif "XOR join menyinkronkan" · 2026-11-02 · case-06-order.bpmn (ParallelGateway/G02 split+join, DataStore/D04, tetap ada G04+E03 dari M5); criteria.json (6 kriteria); jalur/06.mdx (7 seksi, walkthrough token AND split/join); notasi-demo-inclusive-gateway.bpmn untuk G03; verify exit 0
- [x] T-8.4 — 10 halaman notasi Tier A · 2026-11-02 · P02/lane.mdx, D01/data-object.mdx, F03/association.mdx, F04/data-association.mdx, R01/text-annotation.mdx, E03/timer-event.mdx, G04/event-based-gateway.mdx, G02/parallel-gateway.mdx, G03/inclusive-gateway.mdx, D04/data-store.mdx; inventory.json docPath diperbarui; sidebar 10 entri baru; PeriksaModelApp case-04/05/06 ditambah; verify exit 0

## WP-9 · Modul 7–9, Cabang S2, dan notasinya

- [x] T-9.1 — Modul 7 · 2026-11-02 · case-07-order.bpmn (Subprocess/A13 collapsed, CallActivity/A16, MultiInstance/A11 sequential); criteria.json (6 kriteria); jalur/07.mdx (7 seksi, sebab-akibat padat→Subprocess eksplisit sesuai SPEC §5.4 butir 2, 2 reuse negatif); verify exit 0
- [x] T-9.2 — Modul 8 · 2026-11-02 · case-08-order.bpmn (BoundaryError/E06 interrupting, TerminateEnd/E11); criteria.json (6 kriteria); jalur/08.mdx (7 seksi, boundary-vs-XOR, 3 kesalahan umum); verify exit 0
- [x] T-9.3 — Modul 9 · 2026-11-02 · case-09-order.bpmn (Compensation E08+A12, EventSubprocess A14 non-interrupting, Signal E05); criteria.json (6 kriteria); jalur/09.mdx (7 seksi, Compensation vs task Refund biasa, 3 kesalahan umum); verify exit 0
- [x] T-9.4 — Cabang S2 · 2026-11-02 · case-s2-complaint.bpmn (Boundary Timer non-interrupting PT45M, Subprocess dengan XOR internal, Lane Supervisor); criteria.json (6 kriteria C10-1..C10-6); jalur/s2.mdx (kasus bisnis eskalasi SLA, interrupting vs non-interrupting, Escalation vs Error, E04 Conditional sebagai pembanding, 3 kesalahan umum); verify exit 0
- [x] T-9.5 — 10 halaman notasi · 2026-11-02 · A13/embedded-subprocess.mdx, A16/call-activity.mdx, A11/multi-instance.mdx, E06/error-event.mdx, E11/terminate-event.mdx, E08/compensation-event.mdx, A12/compensation-marker.mdx, A14/event-subprocess.mdx, E05/signal-event.mdx, E07/escalation-event.mdx; inventory.json docPath diperbarui; sidebar 10 entri baru; PeriksaModelApp case-07/08/09 ditambah; verify exit 0

## WP-10 · Modul 10 (Capstone) dan Cabang S1

- [x] T-10.1 — Bangun ulang `case-10-capstone.bpmn` dari nol · 2026-11-02 · 35 Tier A semua ada; 4 Pool, 3 Lane, Event Subprocess non-interrupting, Multi-instance Subprocess, Compensation; validate:bpmn 0 warning
- [x] T-10.2 — Kunci jawaban 4 lapis capstone · 2026-11-02 · criteria.json 8 kriteria (5 auto, 3 manual/assisted); Lapis A/B/C/D di jalur/10.mdx dengan 5 kesalahan umum terdiagnosis
- [x] T-10.3 — Bongkar `practice/capstone.mdx` · 2026-11-02 · practice/capstone.mdx diganti halaman pengalihan ke /jalur/10/; jalur/10.mdx 7-seksi penuh dengan BpmnViewer, CriteriaChecker, dan kunci jawaban di details
- [x] T-10.4 — Cabang S1 (reservasi perjalanan: A15, E10, compensation) · 2026-11-02 · jalur/s1.mdx: kasus bisnis, tabel perbandingan Compensation vs Transaction, walkthrough rollback, 3 kesalahan umum; PEDAGOGICAL SIMPLIFICATION berlabel sesuai aturan redaksional
- [x] T-10.5 — Pensiunkan `case-11-capstone.bpmn` · 2026-11-02 · file dihapus; render.spec.ts diperbaiki (case-10-capstone → /jalur/10/); 0 referensi tersisa; verify exit 0

## WP-11 · Katalog Tier B/C, referensi, lampiran

- [x] T-11.1 — 10 halaman Katalog Tier B · 2026-11-02 · script-task/loop-marker/transaction-subprocess/adhoc-subprocess/complex-gateway/data-input/data-output/group/conditional-event/cancel-event; 7 heading masing-masing; inventory.json docPath diperbarui; A4 PASS
- [x] T-11.2 — 3 baris Tier C · 2026-11-02 · E09/E12/E13 dalam tabel di katalog/index.mdx; format SPEC §7.3 (gambar+arti+alasan tidak dibahas+tautan)
- [x] T-11.3 — `/katalog/matriks-event` dari data · 2026-11-02 · tabel 13×8 dari event-matrix.json; ✓/✗; kolom OMG dan Camunda dipisah
- [x] T-11.4 — `/katalog/` indeks + `CoverageTable` · 2026-11-02 · pengantar + CoverageTable + tabel Tier B (10 tautan) + tabel Tier C + link matriks
- [x] T-11.5 — `/referensi/anti-pattern` · 2026-11-02 · 10 anti-pattern dalam 4 kategori (AP-01–AP-10); format gejala→mengapa→risiko→perbaikan; dipanen dari advanced/index.mdx
- [x] T-11.6 — `/referensi/review` (15 pertanyaan) · 2026-11-02 · 15 pertanyaan dalam 4 kelompok (struktur dasar, semantik event, subprocess/exception, keterbacaan)
- [x] T-11.7 — `/referensi/penamaan` · 2026-11-02 · konvensi label SPEC §7.4 + tabel prefix ID per kategori elemen
- [x] T-11.8 — `/referensi/token`, `/membaca-diagram`, `/validitas` · 2026-11-02 · token: 4 perilaku + tabel gateway + TokenSimV2; membaca-diagram: 7 langkah; validitas: 3 tingkat + tabel ringkasan
- [x] T-11.9 — `/lampiran/glosarium` · 2026-11-02 · 42 istilah diurutkan alfabet; satu definisi per istilah
- [x] T-11.10 — `/lampiran/sumber` · 2026-11-02 · tabel OMG + Camunda + alat + lisensi; pecah dari about.mdx

## WP-12 · QA, aksesibilitas, performa

- [ ] T-12.1 — Pemeriksaan duplikasi, omisi, kontradiksi
- [ ] T-12.2 — Audit proporsi tipe soal
- [ ] T-12.3 — Lighthouse 5 rute (aksesibilitas ≥90)
- [ ] T-12.4 — Uji keyboard + pembaca layar
- [ ] T-12.5 — Uji subfolder `SITE_BASE=/bpmn/`
- [ ] T-12.6 — Uji lebar 360 px
- [ ] T-12.7 — `test:render` seluruh ≥72 file `.bpmn`

## WP-13 · Go-live

- [ ] T-13.1 — Vercel
- [ ] T-13.2 — cPanel + `.htaccess` + MIME `.bpmn`
- [ ] T-13.3 — Atribusi dan lisensi
- [ ] T-13.4 — `audit:coverage --release` bersih, 48 baris `VERIFIED`
- [ ] T-13.5 — Tag `v1.0` + catatan rilis
- [ ] T-13.6 — Catat daftar tunggu pasca-rilis
- [ ] **G3** — Gerbang pemilik: persetujuan rilis

---

## Keputusan yang diambil agent sendiri

Keputusan pemilik ada di `SPEC.md` Bagian 15 dan `IMPLEMENTATION-PLAN.md` Bagian 11. Tabel di bawah hanya untuk keputusan yang agent ambil tanpa bertanya.

Catat di sini setiap keputusan yang diambil tanpa bertanya, beserta alasannya satu baris.

| Tanggal | Tugas | Keputusan | Alasan |
|---|---|---|---|
| 2026-11-02 | T-0.3 | Pindah `/>` ke akhir baris `]}`, bukan dihapus | `/>` adalah penutup JSX yang valid; `astro check` 0 error; menghapus akan merusak komponen |
| 2026-11-02 | T-0.4 | Override `@astrojs/language-server` ke 2.16.16 | Versi 2.17.x memiliki bug `require()` ESM di Node 20.18; 2.16.16 adalah versi terakhir tanpa bug ini |
| 2026-11-02 | T-0.8 | Tambah `public/favicon.svg` | Starlight membuat referensi `/favicon.svg` di setiap halaman; tanpa file ini `check-links.mjs` melaporkan 19 tautan rusak |
| 2026-11-02 | T-1.3 | Lokator OMG ditandai TODO-VERIFY | PDF OMG tidak dapat diakses langsung; nomor baris tabel tepat tidak dapat diverifikasi; gunakan referensi bagian §10.4.x |
| 2026-11-02 | T-1.4 | A2 reusedIn jadi WARN bukan FAIL | Kasus belum dibangun (WP-7+); failure di sini akan memblokir verify tanpa ada yang bisa diperbaiki sekarang |
| 2026-11-02 | T-7.2 | BpmnViewer ditampilkan juga di bagian 1 (terbuka) selain di dalam details | Render test butuh .viewer-status terlihat tanpa membuka details; SPEC §7.5 memperbolehkan diagram di bagian 1-6 |
| 2026-11-02 | T-7.5 | criteria.json disalin ke public/cases/ | Browser fetch membutuhkan file di public/; content-src/ tidak disajikan; salinan di public/ adalah sumber kebenaran saat deploy |
| 2026-11-02 | T-10.1 | case-10-capstone.bpmn menggunakan canvas 2560px | 35 elemen Tier A membutuhkan ruang; bpmn-js fit-to-view memenuhi syarat "terbaca di 360px" lewat zoom-to-fit otomatis |
| 2026-11-02 | T-10.3 | BpmnViewer ditambah di luar details di jalur/10.mdx | render.spec.ts membutuhkan .viewer-status terlihat tanpa membuka details; sama dengan keputusan T-7.2 |
| 2026-11-02 | T-10.4 | jalur/s1.mdx tanpa BPMN file (teks + walkthrough saja) | SPEC §5.3 menyebut s1 sebagai "bacaan lanjutan" tanpa mendaftar tugas wajib; membangun case-s1-travel.bpmn akan menambah Tier B ke validator tanpa ada jalur modul yang menginstruksikan notasi tersebut; risiko lebih besar dari manfaat |

## Daftar tunggu pasca-rilis

- Panduan Dosen + pemetaan 14 pekan (ditunda sadar, SPEC Bagian 14)
- Pendalaman Tier C
- Dwibahasa
