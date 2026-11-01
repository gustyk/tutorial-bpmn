# GAP ANALYSIS — Codebase Eksisting vs SPEC.md

**Tanggal audit:** 2026-11-01 · **Auditor:** Claude Opus 5 · **Acuan:** [SPEC.md](SPEC.md) v1.0
**Commit saat audit:** `19d580a` (versi awal2) · **Status working tree:** bersih
**Lingkungan audit:** WSL2 (Linux 6.18), Node v20.18.0, npm 10.8.2, `node_modules/` **tidak terpasang**

Dokumen ini adalah temuan faktual, bukan rencana. Rencana ada di [IMPLEMENTATION-PLAN.md](IMPLEMENTATION-PLAN.md). Setiap temuan punya ID yang dirujuk oleh Work Package di dokumen rencana.

---

## 1. Papan skor

Angka "ada" diukur dari codebase, bukan dari niat.

| Dimensi | Ada sekarang | Target SPEC | Tercapai |
|---|---|---|---|
| Build produksi berhasil | **belum pernah** | wajib | 0% |
| Halaman notasi Tier A (template 19 bagian) | 0 | 35 | 0% |
| Halaman Katalog Tier B (template 7 bagian) | 0 | 10 | 0% |
| Baris Katalog Tier C | 0 | 3 | 0% |
| Modul Jalur Belajar sesuai struktur 7.5 | 0 | 12 (10 + 2 cabang) | 0% |
| `criteria.json` (kunci jawaban lapis B) | 0 | 12 | 0% |
| File `.bpmn` | 2 | ≥72 (12 solusi + ≥24 variasi + ≥36 kesalahan) | 3% |
| Soal latihan | **1** | ≥150 | <1% |
| Komponen yang dibutuhkan | 6 (3 di antaranya perlu ditulis ulang besar) | 13 | 23% |
| Rute situs | 18 | ~70 | 26% |
| Baris `inventory.json` berstatus VERIFIED | 0 dari 48 | 48 | 0% |
| Notasi dengan field `tier`/`introducedIn` | 0 dari 48 | 48 | 0% |
| Skrip validasi BPMN dapat dijalankan | **tidak** | wajib | 0% |
| CI / pemeriksa tautan / Lighthouse otomatis | tidak ada | wajib | 0% |

Kesimpulan satu kalimat: **yang ada sekarang adalah purwarupa tata letak dan purwarupa riset, bukan 20% dari produk.** Kerangka Astro + Starlight, komponen viewer, dan paket riset 48 notasi adalah aset nyata yang layak dipertahankan; seluruh lapisan konten, lapisan latihan, dan lapisan verifikasi harus dibangun dari nol.

---

## 2. Aset yang layak dipertahankan

Ini penting dicatat supaya agent tidak membuang hal yang sudah benar.

| Aset | Lokasi | Catatan |
|---|---|---|
| Kerangka Astro 5 + Starlight 0.37, `output: 'static'`, locale `id` | `astro.config.mjs` | Pilihan tepat untuk Vercel + cPanel. Pertahankan. |
| `base` dapat dikonfigurasi lewat `SITE_BASE` | `astro.config.mjs:4` | Mekanisme subfolder cPanel sudah benar. Pertahankan. |
| `BpmnViewer` berbasis `NavigatedViewer` | `src/components/BpmnViewer.astro` | Pemuatan, fit-viewport, ResizeObserver, pesan galat, tombol unduh sudah benar. Perlu diperluas, bukan diganti. |
| `BpmnNotationGallery` (361 baris SVG ikon buatan sendiri) | `src/components/BpmnNotationGallery.astro` | Memenuhi larangan menyalin SVG Camunda. Jadikan basis `NotationIcon`. |
| Paket riset 48 notasi + 13 tipe event + 8 posisi + 5 sumber + 3 limitasi tercatat jujur | `content-src/00-research/` | Fondasi data yang baik. Perlu diperluas, bukan diulang. |
| Palet warna + kontras + dark mode | `src/styles/custom.css` | Siap pakai. |
| Footer atribusi pemilik + lisensi | `src/components/Footer.astro` | Sesuai SPEC. |
| `validate-bpmn.mjs`: logika pemeriksaan DI, `sourceRef/targetRef`, message flow lintas pool | `scripts/validate-bpmn.mjs` | **Logikanya bagus dan sesuai SPEC 12.** Hanya impor dan dependensinya yang rusak. |

---

## 3. Temuan

Severitas: **BLOCKER** (menghalangi semua pekerjaan lain) · **TINGGI** (menghalangi klaim selesai) · **SEDANG** · **RENDAH**.

### 3.1 Toolchain dan verifikasi

#### F-01 · BLOCKER · Build belum pernah berhasil
`astro-build-output.txt` bukan log sukses — ia log galat PowerShell berkodekan UTF-16 dari path lain (`/home/caktyk/Apps/camunda`), berisi:
> `Failed to resolve entry for package "@astrojs/starlight"`

`node_modules/` tidak ada di lingkungan ini. Artinya tidak satu pun klaim di `plan-bpmnTutorialWebsite.prompt.md` bagian Verification yang pernah dibuktikan. Penyebab yang paling mungkin: `npm install` dijalankan dengan Node Windows (`C:\Users\caktyk\AppData\Local\hermes\node\node.exe`) terhadap direktori yang diakses lewat `\\wsl.localhost\`, sehingga binary dan symlink tidak cocok.
**SPEC:** 13.3 · **Ditutup oleh:** WP-0

#### F-02 · BLOCKER · `scripts/validate-bpmn.mjs` tidak dapat dijalankan
Dua cacat sekaligus:
1. `bpmn-moddle` **tidak terdaftar** di `package.json` (hanya `bpmn-js`, yang membawanya sebagai dependensi transitif). Hasil eksekusi nyata: `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'bpmn-moddle'`.
2. `scripts/validate-bpmn.mjs:2` memakai named import `import { BpmnModdle } from 'bpmn-moddle'`, sedangkan paket itu mengekspor kelasnya sebagai **default export**. Perlu diverifikasi setelah instalasi; bila benar, `new BpmnModdle()` akan gagal dengan TypeError.

Konsekuensi: DoD "jangan mengklaim valid sebelum lolos validator" belum pernah bisa ditegakkan.
**SPEC:** 12.6, 13.2 · **Ditutup oleh:** WP-0

#### F-03 · TINGGI · `scripts/audit-coverage.mjs` tidak menegakkan apa pun
- Ketika 0 dari 48 baris berstatus VERIFIED, skrip hanya `console.warn` dan **keluar dengan kode 0**. Hasil eksekusi nyata: `Coverage NOT VERIFIED: 0/48` lalu `exit=0`. Gerbang yang selalu hijau bukan gerbang.
- Skrip mengunci diri pada halaman tertentu: ia mewajibkan tepat 61 baris bernomor urut di `src/content/docs/events/catalog.mdx`. SPEC 11 memindahkan halaman itu ke `/katalog/matriks-event`, jadi audit akan pecah begitu IA dirapikan.
- Tidak ada audit untuk aturan SPEC 13.3: Tier, `introducedIn`, pengulangan minimal 2 kasus, 5 titik reuse negatif, proporsi tipe soal, kelengkapan 19/7 bagian.
**SPEC:** 4.4, 13.3 · **Ditutup oleh:** WP-1

#### F-04 · TINGGI · Tidak ada CI, pemeriksa tautan, uji render headless, Lighthouse otomatis, linter
`@playwright/test` terdaftar sebagai devDependency tetapi **tidak ada konfigurasi dan tidak ada satu pun file tes** — dependensi mati. DoD SPEC 13.3 mewajibkan render headless semua model, tautan internal hidup, dan Lighthouse aksesibilitas ≥90; tidak ada mekanisme yang mengukurnya. Remote `origin` sudah ada (`github.com/gustyk/tutorial-bpmn`), jadi GitHub Actions layak dipakai.
**SPEC:** 13.3 · **Ditutup oleh:** WP-0

### 3.2 Lapisan data

#### F-05 · TINGGI · `inventory.json` belum punya field yang diwajibkan SPEC 4.4
48 entri `elements` tidak punya `tier`, `introducedIn`, `slug`, maupun `reusedIn`; 13 entri `events` tidak punya `tierByPosition`. Status: 41 DRAFTED, 7 TODO, **0 VERIFIED**. Selama field ini belum ada, tabel coverage dan matriks notasi×kasus tidak bisa diturunkan dari data, dan SPEC 4.4 melarang menuliskannya tangan di MDX.
**SPEC:** 4.4 · **Ditutup oleh:** WP-1

#### F-06 · TINGGI · Paket riset masih mencatat dirinya belum terverifikasi
`content-src/00-research/inventory.json` bagian `limitations` menyatakan sendiri: posisi event dan kombinasi trigger masih provisional; warna dukungan Camunda tidak terekstraksi dari halaman dan "tidak boleh dikira-kira"; klaim "61 varian" belum tervalidasi. Event Compatibility Matrix yang SPEC 13.3 wajibkan (seluruh kombinasi, kolom OMG dan Camunda terpisah) karena itu belum punya dasar terverifikasi.
**SPEC:** 2.1, 13.3, 13.4 · **Ditutup oleh:** WP-1

#### F-07 · SEDANG · Konfigurasi koleksi ganda
`src/content/docs/config.ts` mendefinisikan ulang `collections` dengan `docsSchema()` tanpa `docsLoader`, padahal `src/content.config.ts` sudah melakukannya dengan benar untuk Astro 5. File di dalam direktori konten itu kode mati yang menyesatkan, dan akan bertabrakan konsep begitu skema diperluas (`extend`) untuk frontmatter kasus dan notasi.
**SPEC:** — · **Ditutup oleh:** WP-1

### 3.3 Konten

#### F-08 · BLOCKER · 20 baris `/>` liar di 11 dari 15 halaman MDX
Setiap pemanggilan komponen diikuti satu baris `/>` berdiri sendiri, yang akan terender sebagai teks literal di halaman. Lokasi: `activities/subprocess.mdx:41`, `activities/task.mdx:40,59`, `advanced/index.mdx:19,31,44,56,69,86`, `data/index.mdx:32`, `events/index.mdx:31,65,85`, `fondasi/apa-itu-bpmn.mdx:27,62`, `fondasi/token.mdx:22`, `gateways/index.mdx:21,43`, `participants/flow.mdx:48`, `participants/pool-lane.mdx:18`. Cacat ini seragam, jadi ia berasal dari proses pembangkitan, bukan dari kelalaian setempat — dan ia membuktikan bahwa halaman-halaman ini **belum pernah dilihat di browser**.
**SPEC:** 13.3 · **Ditutup oleh:** WP-0 (perbaikan segera agar baseline bisa dibangun), tuntas di WP-6

#### F-09 · TINGGI · Nol halaman mengikuti template 19 bagian
Tidak ada satu pun halaman per-notasi. Yang ada adalah halaman bertema yang memuat banyak notasi sekaligus: `gateways/index.mdx` (5 KB) membahas XOR, AND, OR, Event-Based, **dan Complex Gateway** dalam satu halaman, lengkap dengan decision tree dan tabel perbandingan. Padahal SPEC 4.2 menempatkan Complex Gateway di Tier B (Katalog) dan SPEC 6.1 melarang membuka bahasan dengan daftar simbol sebelum ada kebutuhan bisnis. Pola yang sama berlaku untuk `events/index.mdx`, `activities/task.mdx`, dan `data/index.mdx`.
**SPEC:** 4.1, 6.1, 7.1 · **Ditutup oleh:** WP-6, WP-7, WP-8

#### F-10 · TINGGI · Halaman latihan membocorkan seluruh jawabannya
`practice/narrative.mdx` menyajikan Kasus Bisnis, lalu langsung **Analisis**, **Pemilihan notasi**, **Argumen**, dan **Validity review** di halaman yang sama. `practice/capstone.mdx` sama: requirement, kandidat, keputusan, model alternatif yang ditolak, dan walkthrough token semuanya terbuka. Mahasiswa tidak pernah dipaksa berpikir. Tidak ada tugas, tidak ada kriteria, tidak ada pemisahan kunci jawaban.
**SPEC:** 7.5, 8 · **Ditutup oleh:** WP-6 (narrative → Modul 1–3), WP-9 (capstone)

#### F-11 · TINGGI · `case-11-capstone.bpmn` tidak layak sebagai alat ukur
Isi faktual model: 5 participant (4 di antaranya black-box), 1 process, 16 sequence flow, 5 message flow, 2 parallel gateway, 1 event-based gateway, 2 intermediate catch, 1 boundary event, 1 error event definition, 1 timer.

Yang **tidak ada**: `exclusiveGateway` (0), `lane` (0), `dataObject` (0), `dataStore` (0), `subProcess` (0), `callActivity` (0), marker multi-instance (0), compensation (0), terminate (0), signal (0), escalation (0), inclusive gateway (0), text annotation (0).

Cakupannya sekitar **12 dari 35 notasi Tier A**, sedangkan SPEC 5.2 Kasus 10 mewajibkan "seluruh Tier A yang relevan". Model ini harus dibangun ulang, bukan ditambal.
**SPEC:** 5.2, 13.2 · **Ditutup oleh:** WP-9

#### F-12 · TINGGI · Tangga kasus kumulatif tidak ada
Hanya `case-01-order.bpmn` (4 node, 3 flow) dan `case-11-capstone.bpmn`. Kasus 2 sampai 9 dan kedua modul cabang tidak ada. Tidak ada folder `content-src/cases/`, tidak ada `criteria.json`, tidak ada `solution.md`, tidak ada file variasi, tidak ada file kesalahan. `case-01` juga belum memakai `id` yang dirancang stabil antarversi seperti dituntut SPEC 12.5, dan penamaannya Title Case ("Verifikasi Pesanan", "Pesanan Siap") sedangkan SPEC 7.4 memberi contoh gaya kalimat.
**SPEC:** 5.2, 5.3, 8, 12 · **Ditutup oleh:** WP-6, WP-7, WP-8, WP-9

#### F-13 · TINGGI · Sistem label sumber praktis belum ada
Hanya **10 kemunculan** label di seluruh 15 halaman: 5× `[CAMUNDA]`, 2× `[STANDARD]`, 2× `[BEST PRACTICE]`, 1× `[PEDAGOGICAL SIMPLIFICATION]`. Tidak ada komponen `Callout`; label ditulis sebagai teks biasa. `src/styles/custom.css:41-45` sudah menyediakan empat kelas callout, tetapi **tidak satu pun dipakai di konten**, dan keempatnya **hanya dibedakan oleh `border-color`** — melanggar syarat SPEC 1.3/2.2 bahwa callout tidak boleh bergantung pada warna saja dan bahwa `[CAMUNDA]` harus bisa terkuncup di Modul 1–4. Tidak ada satu pun pernyataan yang mencantumkan klausa OMG sebagai pelokasi sumber.
**SPEC:** 2.2, 13.1 · **Ditutup oleh:** WP-2 (komponen), WP-6..WP-10 (penerapan)

#### F-14 · TINGGI · Lapisan latihan praktis kosong
**Satu** `<Quiz>` di seluruh proyek (`gateways/index.mdx:24`), bertipe pilihan ganda tunggal. SPEC 10.2 mewajibkan ≥3 soal per halaman Tier A (≥105) ditambah soal per kasus. Enam tipe soal yang diwajibkan SPEC 10.1 — Recognition, Interpretation, Error Detection, Selection, Modeling, Argumentation — hanya satu yang punya dukungan teknis. Tidak ada Checkpoint Kompetensi, tidak ada `localStorage`, dan umpan balik `Quiz.astro` tidak menjelaskan mengapa opsi lain salah (teks `explanation` yang sama dipakai untuk benar maupun salah).
**SPEC:** 10.1, 10.2 · **Ditutup oleh:** WP-2 (mesin), WP-6..WP-10 (isi)

#### F-15 · SEDANG · Halaman referensi dan lampiran belum ada
Rute yang diwajibkan SPEC 11 dan belum ada wujudnya: `/referensi/anti-pattern`, `/referensi/review` (checklist 15 pertanyaan — `practice/review.mdx` yang ada hanya 3,8 KB prosa), `/referensi/penamaan`, `/lampiran/glosarium`, `/lampiran/sumber`, `/katalog/`, `/alat/*`. Atribusi sumber sekarang menumpuk di `about.mdx`.
**SPEC:** 11 · **Ditutup oleh:** WP-10

### 3.4 Komponen

#### F-16 · TINGGI · `TokenSim` terpaku pada satu diagram
`src/components/TokenSim.astro` berisi SVG yang **dikodekan keras** untuk satu diagram AND split/join (lihat `viewBox="0 0 920 300"` dengan koordinat node literal pada baris 15–55), dan `steps` hanya array string naratif. Ia tidak bisa menyimulasikan model BPMN sembarang. SPEC 7.5 mewajibkan walkthrough token untuk **12 kasus**, dan SPEC 6.2 mewajibkan prediksi-sebelum-pengungkapan di setiap simulasi. Komponen ini harus ditulis ulang agar menyorot elemen pada `BpmnViewer` berdasarkan `id` elemen.
**SPEC:** 6.2, 7.5, 8 · **Ditutup oleh:** WP-3

#### F-17 · TINGGI · `BpmnViewer` belum memenuhi kebutuhan SPEC
Yang belum ada: penyorotan elemen berdasarkan `id` (untuk DeltaBlock dan TokenSim), mode berdampingan dua model, pemuatan file `.bpmn` dari komputer mahasiswa, layar penuh, dan zoom tersinkron. Pemuatan juga tidak lazy: skrip `bpmn-js` di-bundel di setiap halaman yang mengimpornya. `role="img"` dipasang pada kanvas interaktif — perlu ditinjau aksesibilitasnya karena kanvasnya dapat dinavigasi, bukan gambar statis.
**SPEC:** 5.4, 9.2 · **Ditutup oleh:** WP-3

#### F-18 · TINGGI · Tujuh komponen yang diwajibkan SPEC belum ada
`Callout`, `Reveal`, `DeltaBlock`, `Checkpoint`, `NotationCard`, `CoverageTable`, `CriteriaChecker`. Yang paling berat adalah `CriteriaChecker` — SPEC 9.3 mendefinisikan 11 aturan pemeriksaan yang seluruhnya harus berjalan di browser terhadap file mahasiswa, berikut kebijakan pelaporan tanpa skor.
**SPEC:** 9.3, 11 · **Ditutup oleh:** WP-2, WP-4

#### F-19 · SEDANG · Alat mahasiswa belum ada sama sekali
Keputusan demo.bpmn.io sudah diambil, tetapi tidak ada halaman onboarding, tidak ada "Muat model Anda", tidak ada pernyataan privasi bahwa pemrosesan terjadi di browser. Tanpa ini, seluruh bagian "Tugas" pada 12 modul tidak bisa dikerjakan mahasiswa.
**SPEC:** 9.1, 9.2 · **Ditutup oleh:** WP-5

### 3.5 Arsitektur informasi dan hosting

#### F-20 · TINGGI · Sidebar dan rute masih mengikuti struktur lama
`astro.config.mjs:19-27` mendefinisikan 7 grup sidebar yang seluruhnya menunjuk rute lama (`/fondasi/`, `/participants/`, `/activities/`, `/gateways/`, `/events/`, `/data/`, `/advanced/`, `/practice/`). Tidak ada `/jalur/`, `/notasi/`, `/katalog/`, `/alat/`, `/referensi/`, `/lampiran/`. `redirects` hanya memetakan 4 jalur `*/index`. Tidak ada halaman 404. `site` tidak diset, sehingga sitemap dan canonical URL tidak bisa dibangkitkan; tidak ada integrasi sitemap maupun `robots.txt`.
**SPEC:** 11 · **Ditutup oleh:** WP-6

#### F-21 · SEDANG · `.htaccess` salah untuk situs statis multi-halaman di subfolder
`public/.htaccess:3-7` memakai fallback gaya SPA: `RewriteRule . /index.html [L]`. Dua masalah: targetnya root-absolute sehingga rusak begitu situs ditaruh di subfolder cPanel (justru skenario yang `SITE_BASE` siapkan), dan ia menelan semua 404 menjadi beranda, padahal Astro statis sudah menghasilkan berkas HTML per rute. Tidak ada `ErrorDocument`, tidak ada aturan cache untuk `.bpmn`.
**SPEC:** 13.3 · **Ditutup oleh:** WP-0 (perbaikan), WP-12 (uji subfolder)

#### F-22 · RENDAH · Kebersihan repositori
- `.gitignore` berakhir dengan baris sampah literal `EOF`, dan mengulang `node_modules/`, `dist/`, `.DS_Store`, `*.log`.
- `astro-build-output.txt` (7 KB log galat UTF-16) ter-commit di root repositori.
- Judul situs `'Tutorial BPMN by Pak Tik'` (`astro.config.mjs:17`) perlu dikonfirmasi pemilik; `SPEC.md` memakai penyebutan formal.
- `mermaid` 11.17 (dependensi berat) dipakai hanya untuk 3 decision tree; perlu keputusan sadar: tetap dipakai dengan lazy-load plus alternatif teks, atau diganti SVG buatan sendiri.
**Ditutup oleh:** WP-0, WP-12

---

## 4. Celah di dalam SPEC.md itu sendiri

Audit ini juga menemukan hal yang SPEC belum atur. Keempatnya perlu persetujuan pemilik karena mengubah SPEC, bukan mengubah kode. Usulan amandemen lengkapnya ada di IMPLEMENTATION-PLAN.md Bagian 11.

| ID | Celah | Usulan |
|---|---|---|
| S-01 | SPEC 11 tidak menyediakan rute untuk **konsep token** dan **cara membaca diagram**, padahal SPEC 1.2 menjanjikan keduanya dan `fondasi/token.mdx` sudah ada isinya | Tambah `/referensi/token` dan `/referensi/membaca-diagram` |
| S-02 | SPEC 13 menyebut tiga tingkat validitas secara tersirat lewat fact-check, tetapi tidak ada rute yang mengajarkannya | Tambah `/referensi/validitas` (syntactic, semantic, pragmatic) |
| S-03 | SPEC 13.2 tidak menyebut jumlah minimum file `.bpmn` yang harus lolos validator | Nyatakan ≥72 file di DoD |
| S-04 | SPEC 9.3 mengandaikan pemeriksa dapat mengenali "activity tertentu" di model mahasiswa, padahal `id` elemen mahasiswa tidak dapat diprediksi | Tambah tiga mode pemeriksaan: `auto` (struktural, bebas label), `assisted` (heuristik label, hasil disampaikan sebagai dugaan), `manual` |

---

## 5. Keputusan migrasi konten lama

Tidak ada halaman lama yang dipertahankan dalam bentuk sekarang. Semuanya ditulis ulang; isinya dipanen sebagai bahan.

| Halaman lama | Perlakuan | Tujuan baru |
|---|---|---|
| `index.mdx` | Tulis ulang | `/` — janji hasil belajar + titik masuk |
| `jalur-belajar.mdx` | Tulis ulang | `/jalur-belajar` — peta 12 modul + status progres |
| `fondasi/apa-itu-bpmn.mdx` | Pecah | `/jalur/01` + `/referensi/membaca-diagram` |
| `fondasi/token.mdx` | Pecah | `/jalur/01` (walkthrough) + `/referensi/token` |
| `participants/pool-lane.mdx` | Pecah | `/notasi/pool`, `/notasi/lane` |
| `participants/flow.mdx` | Pecah | `/notasi/sequence-flow`, `/notasi/message-flow`, `/notasi/association`, `/notasi/data-association` |
| `activities/task.mdx` | Pecah | `/notasi/task` + 7 halaman tipe task |
| `activities/subprocess.mdx` | Pecah | `/notasi/embedded-subprocess`, `/notasi/event-subprocess`, `/notasi/call-activity` |
| `gateways/index.mdx` | Pecah | `/notasi/exclusive-gateway`, `parallel-`, `inclusive-`, `event-based-gateway`; Complex → `/katalog/complex-gateway` |
| `events/index.mdx` | Pecah | 8 halaman `/notasi/*-event` Tier A |
| `events/catalog.mdx` + `events/matrix.mdx` | Gabung, jadikan data | `/katalog/matriks-event`, bersumber dari `inventory.json` |
| `data/index.mdx` | Pecah | `/notasi/data-object`, `/notasi/data-store`, `/notasi/text-annotation`; sisanya → `/katalog/*` |
| `advanced/index.mdx` | Panen | Bahan untuk `/referensi/anti-pattern` dan Modul 8–9 |
| `practice/narrative.mdx` | Bongkar | Analisisnya pindah ke lapis kunci jawaban Modul 1–3 |
| `practice/review.mdx` | Tulis ulang | `/referensi/review` — checklist 15 pertanyaan |
| `practice/capstone.mdx` | Bongkar | `/jalur/10`, analisis pindah ke kunci jawaban |
| `about.mdx` | Pecah | `/tentang` + `/lampiran/sumber` |

Semua rute lama wajib dapat redirect permanen ke tujuan barunya.
