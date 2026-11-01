# IMPLEMENTATION PLAN — Tutorial BPMN 2.0 UISI

**Status:** AKTIF — panduan kebenaran pelaksanaan untuk agent coding AI.
**Versi:** 1.1 · **Tanggal:** 2026-11-01 · **Acuan:** [SPEC.md](SPEC.md) v1.1 · [GAP-ANALYSIS.md](GAP-ANALYSIS.md)

> **Pembagian wewenang tiga dokumen.** `SPEC.md` menentukan **apa** yang dibangun dan **mengapa** — agent tidak boleh mengubahnya tanpa izin pemilik. `GAP-ANALYSIS.md` mencatat **di mana kita sekarang** — dokumen historis, tidak diubah. `IMPLEMENTATION-PLAN.md` (dokumen ini) menentukan **bagaimana, dengan urutan apa, dan kapan sebuah pekerjaan boleh disebut selesai**. Bila dokumen ini bertentangan dengan `SPEC.md`, `SPEC.md` yang menang dan dokumen ini yang harus dikoreksi.

---

## 0. Cara agent memakai dokumen ini

### 0.1 Urutan baca di awal setiap sesi

1. `CLAUDE.md` — aturan kerja wajib.
2. `PROGRESS.md` — apa yang sudah selesai dan tugas mana yang berikutnya.
3. Bagian Work Package yang relevan di dokumen ini.
4. Bagian `SPEC.md` yang dirujuk oleh tugas itu.

Jangan membaca seluruh `SPEC.md` setiap sesi. Baca bagian yang dirujuk tugas.

### 0.2 Satuan kerja

- **WP** (Work Package) = satu kelompok pekerjaan yang punya gerbang mutu sendiri. 14 WP, dari WP-0 sampai WP-13.
- **T-x.y** = satu tugas. Satu tugas = satu kali commit yang masuk akal dibaca manusia.
- Kerjakan **satu WP sampai gerbangnya hijau** sebelum masuk WP berikutnya, kecuali tabel dependensi Bagian 2 secara tegas mengizinkan paralel.

### 0.3 Definisi selesai universal (berlaku untuk SETIAP tugas)

Sebuah tugas hanya boleh ditandai selesai bila **keenam** hal ini benar:

1. Kriteria terima tugas itu terpenuhi seluruhnya.
2. `npm run verify` keluar dengan kode 0 — dan outputnya benar-benar dilihat, bukan diasumsikan.
3. Tidak ada rute atau komponen yang sebelumnya hidup menjadi rusak.
4. `PROGRESS.md` diperbarui: tanda centang, tanggal, dan satu baris catatan.
5. Perubahan ter-commit dengan pesan `WP-x T-x.y: <ringkas>`.
6. Tidak ada klaim dalam laporan yang tidak didukung output perintah yang benar-benar dijalankan.

### 0.4 Larangan keras

1. **Jangan mengarang semantik BPMN.** Setiap pernyataan berlabel `[STANDARD]` wajib menyertakan pelokasi sumber (klausa/tabel OMG BPMN 2.0.2). Bila sumber tidak bisa diakses, tandai pernyataan itu `TODO-VERIFY` dan lanjut ke pekerjaan lain — jangan menuliskannya sebagai fakta.
2. **Jangan menaikkan status `VERIFIED`** pada baris `inventory.json` sebelum fact-check gate SPEC 13.4 benar-benar dijalankan untuk halaman itu.
3. **Jangan membuat atau mengubah file `.bpmn`** tanpa menjalankan `npm run validate:bpmn` sesudahnya.
4. **Jangan mengklaim sesuatu tampak benar** tanpa tangkapan layar Playwright sebagai bukti.
5. **Jangan mengubah `SPEC.md`.** Bila ada kebutuhan, tulis usulan di Bagian 11 dokumen ini dan hentikan pekerjaan yang bergantung padanya.
6. **Jangan menambah dependensi** di luar daftar Bagian 3.4 tanpa izin pemilik.
7. **Jangan menjalankan `npm install` dengan Node Windows** terhadap direktori ini. Lihat Bagian 1.1.

### 0.5 Kapan berhenti dan bertanya ke pemilik

Hentikan pekerjaan dan ajukan pertanyaan bila: (a) sebuah tugas memerlukan perubahan `SPEC.md`; (b) gerbang pemilik (G1, G2, G3) tercapai; (c) sumber OMG atau Camunda tidak dapat diakses sehingga sebuah pernyataan tidak dapat diverifikasi; (d) sebuah keputusan di Bagian 11 belum dijawab padahal tugas bergantung padanya; (e) dua kriteria SPEC saling bertentangan di kasus nyata.

Di luar lima kondisi itu, **ambil keputusan sendiri, catat alasannya di `PROGRESS.md`, dan lanjutkan.**

---

## 1. Lingkungan dan perintah

### 1.1 Aturan lingkungan (penyebab F-01)

Proyek berada di `/mnt/d/Apps/tutorial-bpmn`, yaitu drive Windows yang dipasang di WSL2. Riwayat menunjukkan build pernah dijalankan dengan Node Windows (`C:\Users\...\hermes\node\node.exe`) terhadap path `\\wsl.localhost\...`, dan gagal menyelesaikan entri paket.

**Aturan:** seluruh `npm` dan `node` dijalankan **di dalam WSL** dengan Node Linux. Verifikasi sebelum instalasi pertama:

```bash
which node && node -v     # harus /usr/bin/node atau serupa, bukan /mnt/c/...
```

Bila `node_modules/` pernah dibuat oleh Node Windows, hapus seluruhnya sebelum instalasi ulang.

### 1.2 Perintah

| Perintah | Kegunaan | Sudah ada? |
|---|---|---|
| `npm install` | instalasi dependensi | ya |
| `npm run dev` | server pengembangan | ya |
| `npm run build` | build statis ke `dist/` | ya |
| `npm run preview` | pratinjau hasil build | ya |
| `npm run check` | `astro check` (TypeScript + MDX) | ya |
| `npm run validate:bpmn` | validasi struktural semua `.bpmn` | ya, **rusak** (F-02) |
| `npm run audit:coverage` | audit aturan SPEC 13.3 | ya, **tidak menegakkan** (F-03) |
| `npm run test:render` | render headless semua `.bpmn` + tangkapan layar | **belum ada** |
| `npm run test:rules` | uji unit mesin aturan CriteriaChecker | **belum ada** |
| `npm run links` | pemeriksa tautan internal atas `dist/` | **belum ada** |
| `npm run verify` | agregat: check → build → validate:bpmn → audit:coverage → test:render → links | **belum ada** |

`npm run verify` adalah gerbang tunggal yang dirujuk Bagian 0.3. Ia harus gagal (exit ≠ 0) bila salah satu langkah gagal.

---

## 2. Peta Work Package dan dependensi

| WP | Nama | Bergantung pada | Ukuran | Menutup temuan |
|---|---|---|---|---|
| WP-0 | Fondasi toolchain dan baseline | — | M | F-01, F-02, F-08, F-21, F-22 |
| WP-1 | Lapisan data dan audit | WP-0 | L | F-03, F-05, F-06, F-07 |
| WP-2 | Sistem desain dan komponen dasar | WP-0 | L | F-13, F-14, F-18 |
| WP-3 | Viewer dan simulasi token | WP-0 | L | F-16, F-17 |
| WP-4 | CriteriaChecker | WP-3 | L | F-18 |
| WP-5 | Alat mahasiswa | WP-3, WP-4 | M | F-19 |
| WP-6 | Arsitektur informasi dan migrasi rute | WP-1, WP-2 | M | F-20 |
| WP-7 | **Modul 1–3 + notasinya** → GERBANG G2 | WP-2..WP-6 | XL | F-09, F-10, F-12 |
| WP-8 | Modul 4–6 + notasinya | WP-7 | XL | F-09, F-12 |
| WP-9 | Modul 7–9 + Cabang S2 + notasinya | WP-8 | XL | F-09, F-12 |
| WP-10 | Modul 10 (Capstone) + Cabang S1 | WP-9 | L | F-11 |
| WP-11 | Katalog Tier B/C, referensi, lampiran | WP-1, WP-2 | L | F-15 |
| WP-12 | QA, aksesibilitas, performa | WP-7..WP-11 | M | F-04, F-21, F-22 |
| WP-13 | Go-live dan pasca-rilis | WP-12 | S | — |

**Jalur kritis:** WP-0 → WP-1 → WP-2/WP-3 → WP-4 → WP-6 → WP-7 → WP-8 → WP-9 → WP-10 → WP-12 → WP-13.

**Boleh paralel:** WP-2 dan WP-3 setelah WP-0 selesai. WP-11 boleh dikerjakan kapan pun setelah WP-1 dan WP-2, dan sengaja ditempatkan agar bisa menjadi pekerjaan selingan ketika sebuah gerbang pemilik sedang menunggu jawaban.

**Gerbang pemilik:**
- **G1** setelah WP-1 — tabel Tier dan Event Compatibility Matrix ditinjau pemilik sebelum 35 halaman ditulis di atasnya.
- **G2** setelah WP-7 — Modul 1–3 sebagai purwarupa mutu. **Jangan melanjutkan ke WP-8 sebelum pemilik menyetujui.** Ini gerbang terpenting; salah gaya di tiga modul pertama berarti sembilan modul berikutnya harus ditulis ulang.
- **G3** sebelum WP-13 — persetujuan rilis.

---

## 3. Arsitektur target

### 3.1 Struktur direktori

```
/
├── SPEC.md                      sumber kebenaran produk
├── IMPLEMENTATION-PLAN.md       dokumen ini
├── GAP-ANALYSIS.md              audit 2026-11-01 (tidak diubah)
├── PROGRESS.md                  status pelaksanaan (diperbarui agent)
├── CLAUDE.md                    aturan kerja agent
├── schemas/
│   ├── inventory.schema.json
│   ├── criteria.schema.json
│   ├── tokensim.schema.json
│   └── quiz.schema.json
├── content-src/
│   ├── 00-research/             inventory.json, event-matrix.json, research-notes.md
│   └── cases/
│       └── case-NN-<slug>/      case.md, criteria.json, solution.md,
│                                solution.bpmn, variants/, mistakes/
├── public/
│   ├── bpmn/                    salinan terbit semua .bpmn
│   └── .htaccess
├── scripts/
│   ├── validate-bpmn.mjs        validasi struktural
│   ├── audit-coverage.mjs       penegak aturan SPEC 13.3
│   ├── check-links.mjs
│   └── sync-cases.mjs           content-src/cases/**/*.bpmn → public/bpmn/
├── src/
│   ├── content.config.ts        skema frontmatter (notasi + kasus)
│   ├── components/              13 komponen
│   ├── lib/
│   │   ├── rules/               mesin aturan CriteriaChecker
│   │   └── inventory.ts         pembaca inventory.json saat build
│   ├── styles/custom.css
│   └── content/docs/            seluruh rute
└── tests/
    ├── render.spec.ts           Playwright: render semua .bpmn
    └── rules.spec.ts            uji unit aturan
```

**Satu sumber satu kebenaran.** File `.bpmn` ditulis di `content-src/cases/`, lalu disalin ke `public/bpmn/` oleh `scripts/sync-cases.mjs` pada tahap prebuild. Jangan mengedit `public/bpmn/` secara langsung.

### 3.2 Konvensi penamaan

| Hal | Pola | Contoh |
|---|---|---|
| Direktori kasus | `case-NN-<slug-indonesia>` | `case-05-batas-waktu-pembayaran` |
| File solusi | `case-NN-<slug>.bpmn` | `case-05-batas-waktu-pembayaran.bpmn` |
| File variasi | `case-NN-variant-<slug>.bpmn` | `case-05-variant-boundary-timer.bpmn` |
| File kesalahan | `case-NN-mistake-<slug>.bpmn` | `case-05-mistake-xor-menunggu.bpmn` |
| Rute modul | `/jalur/NN` | `/jalur/05` |
| Rute notasi | `/notasi/<slug-inggris>` | `/notasi/event-based-gateway` |
| `id` elemen BPMN | `<Tipe>_<PascalCase>` | `Gateway_TungguPembayaran` |
| ID kriteria | `C<NN>-<n>` | `C05-2` |
| ID tugas | `T-<wp>.<n>` | `T-7.3` |

`id` elemen BPMN **wajib stabil antarversi kasus** (SPEC 12.5): elemen yang sama di Kasus 4 dan Kasus 5 memakai `id` yang sama, supaya delta dapat dihitung otomatis.

### 3.3 Aliran data

```
inventory.json + event-matrix.json
   ├─→ src/lib/inventory.ts ─→ CoverageTable, /katalog/, matriks event, frontmatter notasi
   └─→ scripts/audit-coverage.mjs ─→ penegakan DoD

content-src/cases/case-NN/
   ├─ criteria.json ─→ halaman kasus (daftar kriteria) + CriteriaChecker (mesin aturan)
   ├─ solution.bpmn ─→ sync-cases.mjs ─→ public/bpmn/ ─→ BpmnViewer, TokenSim
   └─ case.md ─→ konten /jalur/NN
```

Tidak boleh ada tabel Tier, daftar kriteria, atau matriks event yang ditulis tangan di MDX. Semuanya diturunkan dari data.

### 3.4 Dependensi yang diizinkan

Tetap: `astro`, `@astrojs/starlight`, `bpmn-js`, `@astrojs/check`, `typescript`, `@playwright/test`.
Boleh ditambah tanpa izin: `bpmn-moddle` (perbaikan F-02), `@astrojs/sitemap`, `ajv` (validasi JSON Schema di skrip).
Perlu izin pemilik: apa pun yang lain. `mermaid` **dipertahankan** (keputusan D-03): wajib lazy-load dan wajib punya alternatif teks untuk setiap decision tree.

---

## 4. Kontrak data

Agent membuat file skema ini di WP-1 dan WP-4, lalu memvalidasinya di `npm run verify`.

### 4.1 `inventory.json` — entri `elements`

```jsonc
{
  "id": "G04",                            // tetap, dari paket riset
  "category": "Gateway",
  "notation": "Event-Based Gateway",
  "variants": "Exclusive, parallel; instantiate behavior",
  "camunda": "Camunda Reference: Event-based Gateway; Coverage: eventBasedGateway",
  "tier": "A",                            // A | B | C — dari SPEC Bagian 4
  "slug": "event-based-gateway",          // menentukan rute /notasi/ atau /katalog/
  "docPath": "src/content/docs/notasi/event-based-gateway.mdx",
  "introducedIn": "case-05",              // null untuk Tier B/C
  "reusedIn": ["case-09"],                // SPEC 13.3: Tier A wajib ≥1
  "negativeReuseIn": [],                  // kasus yang memakainya sebagai contoh pilihan SALAH
  "sources": [
    { "ref": "omg-bpmn-202", "locator": "§10.6.5, Tabel 10.37" },
    { "ref": "camunda-coverage", "locator": "eventBasedGateway, 8.9" }
  ],
  "status": "TODO"                        // TODO → DRAFTED → VERIFIED
}
```

Entri `events` ditambah:

```jsonc
{
  "type": "Timer",
  "allowed": "Start, IntermediateCatch, BoundaryInterrupting, ...",
  "tierByPosition": {
    "Start": "A", "IntermediateCatch": "A", "IntermediateThrow": null,
    "BoundaryInterrupting": "A", "BoundaryNonInterrupting": "A",
    "EventSubprocessInterrupting": "B", "EventSubprocessNonInterrupting": "B", "End": null
  },
  "status": "TODO"
}
```

`null` berarti posisi itu tidak sah untuk trigger tersebut. Nilai diambil dari SPEC 4.1.

### 4.2 `event-matrix.json` — hasil verifikasi riset (T-1.3)

```jsonc
{
  "schemaVersion": 1,
  "verifiedOn": "2026-11-xx",
  "cells": [
    {
      "trigger": "Error",
      "position": "Start",
      "omgValid": false,
      "omgLocator": "§10.4.2, Tabel 10.84",
      "camundaExecutable": null,
      "camundaLocator": null,
      "note": "Sah hanya sebagai start event di Event Subprocess, bukan di Process."
    }
  ]
}
```

Aturan: `omgValid` tidak boleh `null` setelah T-1.3 selesai. `camundaExecutable` boleh `null` dengan `note` yang menjelaskan mengapa belum terverifikasi — tetapi tidak boleh dikira-kira (F-06).

### 4.3 `criteria.json` — kunci jawaban lapis B

```jsonc
{
  "schemaVersion": 1,
  "caseId": "case-05",
  "criteria": [
    {
      "id": "C05-1",
      "statement": "Batas waktu pembayaran diekspresikan sebagai event yang menunggu, bukan sebagai XOR atas data status pembayaran.",
      "rationale": "Pada saat token tiba, status pembayaran belum menjadi data yang dapat dievaluasi.",
      "readIfFailed": ["/notasi/timer-event", "/notasi/event-based-gateway", "/notasi/exclusive-gateway"],
      "check": {
        "mode": "auto",
        "anyOf": [
          { "rule": "boundary-attached-to", "eventDefinition": "bpmn:TimerEventDefinition", "interrupting": true },
          { "rule": "element-exists", "type": "bpmn:EventBasedGateway", "min": 1 }
        ]
      }
    },
    {
      "id": "C05-2",
      "statement": "Jalur timeout benar-benar mengakhiri pesanan, bukan hanya mengirim pengingat.",
      "check": {
        "mode": "manual",
        "question": "Ikuti jalur timeout pada model Anda. Apakah ia berakhir pada End Event yang menyatakan pesanan dibatalkan?"
      }
    },
    {
      "id": "C05-3",
      "statement": "Task yang menunggu pembayaran dibatalkan ketika timer menang.",
      "check": {
        "mode": "assisted",
        "rule": "boundary-attached-to",
        "activityMatch": { "nameMatches": "(?i)(pembayaran|payment)" },
        "eventDefinition": "bpmn:TimerEventDefinition",
        "assistedNote": "Pemeriksa mencocokkan nama task, jadi hasilnya dugaan. Pastikan sendiri task yang dimaksud benar."
      }
    }
  ]
}
```

**Tiga mode (SPEC 9.3).** `auto` = struktural, tidak bergantung label mahasiswa, hasilnya dapat dipercaya. `assisted` = memakai heuristik nama elemen; hasil **wajib** disampaikan sebagai dugaan beserta `assistedNote`. `manual` = tidak diperiksa mesin; menampilkan pertanyaan pemandu.

Setiap kasus wajib ≥4 kriteria (SPEC 13.2), dan **minimal 2 di antaranya bermode `auto`** — supaya self-check punya nilai nyata, bukan hanya daftar pertanyaan.

### 4.4 Kosakata aturan pemeriksa (SPEC 9.3)

| `rule` | Parameter | Semantik |
|---|---|---|
| `element-exists` | `type`, `min`, `max?` | jumlah elemen bertipe tertentu |
| `boundary-attached-to` | `eventDefinition`, `interrupting?`, `activityMatch?` | boundary event menempel pada activity |
| `no-sequence-flow-across-participants` | — | tidak ada Sequence Flow melintasi batas pool |
| `message-flow-between-participants` | `min` | ada Message Flow antarpeserta |
| `gateway-split-labeled` | `type` | setiap outgoing flow punya `conditionExpression` atau menjadi `default` |
| `gateway-join-type` | `splitType`, `joinType` | tipe join cocok dengan tipe split |
| `marker-on-activity` | `marker` (`multiInstance`\|`compensation`\|`loop`), `activityMatch?` | marker terpasang pada activity |
| `compensation-has-handler` | — | setiap compensation throw punya handler yang dapat dijangkau |
| `all-tokens-reach-end` | — | setiap flow node punya jalur ke End Event |
| `subprocess-start-event` | — | Embedded Subprocess memakai None Start Event |
| `event-position-valid` | — | setiap event berada pada posisi yang sah menurut `event-matrix.json` |

Kombinator: `anyOf`, `allOf`, `not`.

### 4.5 `tokensim` — langkah simulasi

```jsonc
{
  "schemaVersion": 1,
  "diagram": "/bpmn/case-06-paralel.bpmn",
  "prediction": "Setelah AND split, berapa token yang aktif?",
  "steps": [
    {
      "tokensAt": ["Gateway_Split"],
      "narrative": "Satu token tiba di AND split.",
      "altText": "Token berada di gateway AND split."
    },
    {
      "tokensAt": ["Task_SiapkanBarang", "Task_TerbitkanInvoice"],
      "narrative": "AND split menghasilkan dua token yang berjalan bersamaan.",
      "altText": "Dua token aktif, satu di tiap cabang."
    }
  ]
}
```

`tokensAt` memakai `id` elemen pada file `.bpmn` — inilah alasan `id` harus stabil (Bagian 3.2).

### 4.6 Frontmatter

Halaman modul (`/jalur/NN`):

```yaml
title: "Modul 5 — Pembayaran punya batas waktu"
caseId: case-05
module: 5
spine: true
introduces: [E03, G04]
reuses: [G01, P01, F02, E02]
negativeReuse: [G01]
prevModule: 4
estMinutes: 45
```

Halaman notasi (`/notasi/<slug>`):

```yaml
title: Event-Based Gateway
notationId: G04
tier: A
introducedIn: case-05
confusedWith: [G01, E03]
```

`src/content.config.ts` memperluas `docsSchema()` dengan kedua bentuk ini (opsional, agar halaman biasa tetap sah). Audit memeriksa bahwa `notationId` cocok dengan `inventory.json` dan `confusedWith` bersifat dua arah.

---

## 5. Resep yang dipakai berulang

Tiga resep ini mencegah WP-7 sampai WP-11 menjadi ribuan tugas kembar. Setiap modul dan setiap halaman notasi dikerjakan dengan resep yang sama.

### 5.1 Resep Modul (dipakai 12×)

Untuk modul `NN`, urutannya **wajib** seperti ini — model dibuat lebih dulu, prosa menyusul, karena prosa harus mendeskripsikan model yang benar-benar ada.

1. **Baca** baris modul di SPEC 5.2/5.3: pemicu requirement, notasi baru, notasi yang wajib diulang, titik reuse negatif.
2. **Bangun `solution.bpmn`** sebagai superset model modul sebelumnya, `id` elemen dipertahankan, label mengikuti SPEC 7.4. Jalankan `npm run validate:bpmn`.
3. **Tulis `criteria.json`** — ≥4 kriteria, ≥2 bermode `auto`, masing-masing punya `readIfFailed`. Jalankan `npm run test:rules` dengan `solution.bpmn` sebagai fixture positif.
4. **Bangun ≥2 `variants/`** yang lolos seluruh kriteria, dan **≥3 `mistakes/`** yang masing-masing gagal pada kriteria tertentu secara sengaja. Fixture negatif ini sekaligus menguji mesin aturan.
5. **Tulis `case.md`**: Apa yang berubah → Kasus bisnis → Requirement bernomor → Panduan analisis (pertanyaan tanpa jawaban) → Tugas.
6. **Tulis `solution.md`**: walkthrough token → argumentasi → variasi yang diterima dengan trade-off → mengapa alternatif ditolak → katalog kesalahan dengan diagnosis.
7. **Rakit halaman `/jalur/NN`**: `DeltaBlock` → konten `case.md` → `CriteriaChecker` → `Reveal` berisi lapis A/C/D + `TokenSim` → `Checkpoint`.
8. **Tulis halaman notasi** untuk setiap entri `introduces`, dengan Resep Notasi (5.2).
9. **Perbarui `inventory.json`**: `introducedIn`, `reusedIn`, `negativeReuseIn`, `docPath`, status `DRAFTED`.
10. **Soal**: tambahkan soal modul sesuai proporsi SPEC 10.1 untuk rentang modul tersebut.
11. **Fact-check gate** SPEC 13.4 per halaman, lalu naikkan status ke `VERIFIED`.
12. `npm run verify` → commit → perbarui `PROGRESS.md`.

**Kriteria terima satu modul:** SPEC 13.2 seluruhnya terpenuhi, dan `npm run audit:coverage` tidak melaporkan pelanggaran untuk `case-NN`.

### 5.2 Resep Halaman Notasi Tier A (dipakai 35×)

1. 19 bagian SPEC 7.1, seluruhnya terisi — bagian kosong adalah kegagalan, bukan kekurangan kecil.
2. Bagian 5 (Semantik) **wajib** menyebut perilaku token atau kontrak komunikasi.
3. Bagian 2 (Gambar Notasi) memakai `NotationIcon`, ikon buatan sendiri, dengan caption bernomor.
4. Bagian 13 (Sering Tertukar) menautkan ke pembandingnya, dan halaman pembanding wajib menautkan balik.
5. Setiap pernyataan yang bisa diperdebatkan diberi `Callout` berlabel beserta pelokasi sumber.
6. Minimal 3 soal, dan minimal satu di antaranya bukan Recognition.
7. Bagian 8–9 (Contoh dan Diagram) merujuk kasus tempat notasi itu diperkenalkan — bukan contoh baru yang berdiri sendiri.
8. Perbarui `inventory.json` (`docPath`, `status`).

### 5.3 Resep Halaman Katalog Tier B (dipakai 10×)

7 bagian SPEC 7.2. Bagian "Kapan Digunakan" **wajib** memuat alasan mengapa notasi itu jarang tepat. Tanpa soal. Tanpa studi kasus.

---

## 6. Work Package rinci

### WP-0 · Fondasi toolchain dan baseline

Tujuan: membuat seluruh klaim di proyek ini dapat diverifikasi. Sebelum WP ini hijau, tidak ada pekerjaan lain yang bermakna.

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-0.1 | Instalasi bersih di WSL. Hapus `node_modules/` bila ada, pastikan Node Linux (Bagian 1.1), `npm install`. | `node -v` ≥ 20.3, `npm ls --depth=0` tanpa UNMET |
| T-0.2 | Perbaiki validator: tambahkan `bpmn-moddle` ke `dependencies`, periksa bentuk ekspornya di `node_modules/bpmn-moddle/package.json`, perbaiki impor di `scripts/validate-bpmn.mjs:2`. | `npm run validate:bpmn` exit 0, melaporkan 2 file lolos |
| T-0.3 | Hapus 20 baris `/>` liar (daftar lokasi ada di GAP F-08). | `grep -rn "^/>" src/content/docs` tidak menghasilkan baris |
| T-0.4 | Build pertama yang berhasil. | `npm run check` dan `npm run build` exit 0; `dist/index.html` ada |
| T-0.5 | Kebersihan repo: hapus `astro-build-output.txt` dan masukkan pola log ke `.gitignore`; buang baris `EOF` dan entri duplikat di `.gitignore`; hapus `src/content/docs/config.ts`. | `npm run build` tetap hijau; `git status` bersih |
| T-0.6 | Perbaiki `public/.htaccess`: buang fallback SPA, tambah `ErrorDocument 404`, aturan cache untuk `.bpmn`, dan pastikan aman di subfolder. | 404 asli muncul untuk rute tak dikenal pada uji WP-12 |
| T-0.7 | Pasang Playwright: `playwright.config.ts`, `tests/render.spec.ts` yang memuat setiap `.bpmn` di `BpmnViewer` dan gagal bila ada galat konsol; simpan tangkapan layar ke `tests/__screenshots__/`. | `npm run test:render` hijau untuk 2 file yang ada |
| T-0.8 | `scripts/check-links.mjs`: pindai `dist/**/*.html`, pastikan setiap tautan internal punya berkas tujuan. | `npm run links` exit 0 |
| T-0.9 | Rangkai `npm run verify`; pastikan gagal bila salah satu langkah gagal (uji dengan merusak satu hal secara sengaja, lalu pulihkan). | `npm run verify` exit 0; eksperimen kegagalan terbukti |
| T-0.10 | CI GitHub Actions `.github/workflows/verify.yml` pada push dan PR ke `main`: Node 20, `npm ci`, `npm run verify`. | Workflow hijau di `github.com/gustyk/tutorial-bpmn` |

**Gerbang WP-0:** `npm run verify` hijau dan CI hijau.

### WP-1 · Lapisan data dan audit

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-1.1 | Perluas `inventory.json` untuk 48 entri `elements` dan 13 entri `events` sesuai kontrak 4.1. Nilai `tier`, `introducedIn`, dan `tierByPosition` **disalin dari SPEC Bagian 4**, bukan ditafsirkan ulang. | Jumlah per tier tepat: A=35, B=10, C=3 |
| T-1.2 | `schemas/inventory.schema.json` + validasi dengan `ajv` di `audit-coverage.mjs`. | Audit gagal bila sebuah field wajib hilang |
| T-1.3 | **Riset verifikasi matriks event.** Periksa setiap sel posisi×trigger terhadap OMG BPMN 2.0.2 (tabel 10.84–10.92) dan Camunda 8.9 coverage. Hasil ke `content-src/00-research/event-matrix.json` sesuai kontrak 4.2, setiap sel membawa pelokasi sumber. Sel yang tidak dapat diverifikasi ditandai, **tidak dikira-kira**. | `omgValid` terisi untuk semua sel; tidak ada sel tanpa pelokasi; `limitations` di research pack diperbarui |
| T-1.4 | Tulis ulang `scripts/audit-coverage.mjs` menjadi penegak nyata, dengan aturan A1–A9 (Bagian 7.2). Lepaskan ketergantungan pada `events/catalog.mdx`. | Keluar non-zero bila ada pelanggaran; `--report` mencetak tabel coverage |
| T-1.5 | Perluas `src/content.config.ts` dengan skema frontmatter notasi dan modul (kontrak 4.6), opsional agar halaman lain tetap sah. | `npm run check` hijau |
| T-1.6 | `src/lib/inventory.ts`: pembaca tunggal untuk konsumsi saat build. | Dipakai `CoverageTable` di WP-2 |

**Gerbang WP-1 → G1:** sajikan ke pemilik: rekap jumlah per tier, tabel `introducedIn` per kasus, dan ringkasan `event-matrix.json` termasuk daftar sel yang belum terverifikasi.

### WP-2 · Sistem desain dan komponen dasar

| Tugas | Komponen | Kriteria terima |
|---|---|---|
| T-2.1 | `Callout.astro` — 4 tipe, masing-masing ikon SVG + label teks + warna; prop `collapsed` untuk `[CAMUNDA]` di Modul 1–4; prop `source` untuk pelokasi. | Dibedakan tanpa warna (ikon + label); dapat dioperasikan dengan keyboard |
| T-2.2 | `Reveal.astro` — pengungkap jawaban; `<details>` asli demi aksesibilitas; mencatat status di `localStorage`. | Dapat dibuka dengan keyboard; status bertahan setelah muat ulang |
| T-2.3 | `Checkpoint.astro` — daftar "saya mampu…" dengan tautan bacaan ulang; `localStorage`. | Status bertahan; terbaca pembaca layar |
| T-2.4 | `Quiz.astro` v2 — 6 tipe SPEC 10.1: `single`, `multi`, `trueFalse`, `errorDetection` (menyertakan `.bpmn`), `selection`, `argumentation` (teks bebas + rubrik 3 poin mandiri). Umpan balik **per opsi**, menjelaskan mengapa opsi lain salah. | Keenam tipe punya contoh yang berjalan; `npm run check` hijau |
| T-2.5 | `NotationIcon.astro` + `NotationCard.astro` — jadikan `BpmnNotationGallery` sumber ikon tunggal, jangan buat set ikon kedua. | Setiap notasi Tier A punya ikon; caption bernomor |
| T-2.6 | `CoverageTable.astro` — dari `src/lib/inventory.ts`, saat build. | Angka cocok dengan `npm run audit:coverage --report` |
| T-2.7 | `DeltaBlock.astro` — ringkasan perubahan + daftar `id` elemen baru, diteruskan ke `BpmnViewer` sebagai `highlight`. | Elemen baru tersorot di `/jalur/NN` |
| T-2.8 | `Figure.astro` — caption "Gambar N.M" dengan penomoran otomatis per halaman. | Nomor berurutan tanpa ditulis tangan |
| T-2.9 | Lintasan aksesibilitas: fokus terlihat, kontras AA, tidak ada informasi yang hanya disampaikan warna. | Pemeriksaan WP-12 nanti lolos |
| T-2.10 | `MermaidDiagram` dibuat lazy-load (dynamic import saat masuk viewport) dan setiap decision tree diberi alternatif teks berupa daftar bersarang (D-03). | Halaman tanpa decision tree tidak memuat `mermaid`; decision tree terbaca pembaca layar |

### WP-3 · Viewer dan simulasi token

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-3.1 | `BpmnViewer` v2: prop `highlight` (array `id`), `height`, `fullscreen`; muat `bpmn-js` secara lazy lewat dynamic import saat masuk viewport; pertahankan fit-viewport, ResizeObserver, tombol unduh, pesan galat yang sudah benar. | Halaman tanpa diagram tidak memuat `bpmn-js`; penyorotan bekerja |
| T-3.2 | Mode berdampingan: prop `compareWith`, zoom tersinkron, dapat ditumpuk di layar sempit. | Dua model tampil; uji pada lebar 360 px |
| T-3.3 | Pemuatan file lokal lewat File API, tanpa unggahan. | File `.bpmn` dari komputer tampil; tidak ada permintaan jaringan keluar |
| T-3.4 | `TokenSim` v2 digerakkan `tokensim` JSON (kontrak 4.5): tombol langkah/putar/reset, pertanyaan prediksi sebelum mulai, narasi per langkah, `altText` untuk pembaca layar. | Berjalan di atas file `.bpmn` sembarang; `fondasi/token` lama dipensiunkan |
| T-3.5 | Hapus `TokenSim` lama setelah semua pemakaiannya dipindah. | Tidak ada referensi tersisa |

### WP-4 · CriteriaChecker

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-4.1 | `schemas/criteria.schema.json` sesuai kontrak 4.3. | Validasi ikut dalam `npm run verify` |
| T-4.2 | `src/lib/rules/` — 11 aturan Bagian 4.4 + kombinator + tiga mode SPEC 9.3. Berjalan di browser dengan `bpmn-moddle`. | `npm run test:rules` hijau |
| T-4.3 | `CriteriaChecker.astro` — unggah lokal → jalankan → laporkan **terpenuhi / belum / perlu diperiksa sendiri**, dengan tautan `readIfFailed`. Hasil `assisted` disampaikan sebagai dugaan. Tanpa skor, tanpa persentase, tanpa putusan lulus-gagal (SPEC 9.3). | Tidak ada angka nilai di antarmuka; teks dugaan muncul untuk mode `assisted` |
| T-4.4 | `tests/rules.spec.ts` dengan fixture: setiap aturan punya satu kasus lolos dan satu kasus gagal. | Cakupan 11 aturan |

### WP-5 · Alat mahasiswa

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-5.1 | `/alat/menggambar` — onboarding demo.bpmn.io dengan delapan topik wajib SPEC 9.1, termasuk **cara memasang Boundary Event** (titik kegagalan tersering) dan peringatan bahwa pekerjaan tidak tersimpan otomatis. | Kedelapan topik ada; disertai tangkapan layar atau ilustrasi sendiri |
| T-5.2 | `/alat/periksa-model` — pemilih kasus + `CriteriaChecker` + `BpmnViewer` berdampingan. | Berfungsi untuk kasus yang sudah ada |
| T-5.3 | Pernyataan privasi: pemrosesan sepenuhnya di browser, situs statis tanpa backend. | Tampil di kedua halaman alat |

### WP-6 · Arsitektur informasi dan migrasi rute

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-6.1 | Bangun seluruh pohon rute SPEC 11 v1.1 — termasuk `/referensi/token`, `/referensi/membaca-diagram`, `/referensi/validitas` — dan sidebar baru di `astro.config.mjs`. Judul situs tetap "Tutorial BPMN by Pak Tik" (D-01). | Semua rute terbangun; tidak ada tautan mati |
| T-6.2 | Redirect seluruh rute lama sesuai tabel GAP Bagian 5. | Setiap URL lama mengarah ke tujuan baru |
| T-6.3 | Halaman 404 kustom yang menawarkan jalan kembali ke peta belajar. | Muncul di Vercel dan di cPanel |
| T-6.4 | Set `site: 'https://bpmn.kodingno.com'` (D-02), tambahkan `@astrojs/sitemap` dan `robots.txt`. | `dist/sitemap-index.xml` ada dan memuat domain itu |
| T-6.5 | Verifikasi pencarian Pagefind atas konten baru. | Kata uji dari 3 halaman ditemukan |

### WP-7 · Modul 1–3 dan notasinya → GERBANG G2

Resep Modul (5.1) untuk `case-01`, `case-02`, `case-03`. Notasi yang ditulis di WP ini (Resep 5.2): E01, A01, A02, F01, G01, A03, A04, A05, A07, P01, C01, F02, E02, A08, A09 — **15 halaman**.

Tambahan khusus WP ini:
- T-7.0 Bongkar `practice/narrative.mdx`: analisisnya menjadi bahan lapis kunci jawaban, bukan konten terbuka (F-10).
- T-7.1 Perbaiki `case-01-order.bpmn`: `id` stabil, label mengikuti SPEC 7.4, jadikan basis superset untuk kasus berikutnya.
- T-7.x Tiga modul dengan Resep 5.1.
- T-7.y Reuse negatif pertama wajib muncul di Modul 2 dan Modul 3 (kolom terakhir SPEC 5.2).

**Gerbang G2 — sajikan ke pemilik:** tautan pratinjau tiga modul, satu halaman notasi sebagai contoh 19 bagian, satu `criteria.json`, dan demonstrasi `CriteriaChecker` memeriksa model yang salah. **Jangan lanjut ke WP-8 tanpa persetujuan.**

### WP-8 · Modul 4–6 dan notasinya

Resep Modul untuk `case-04`, `case-05`, `case-06`. Notasi: P02, D01, F03, F04, R01, E03, G04, G02, G03, D04 — **10 halaman**.
Wajib: reuse negatif "XOR dipakai menunggu hasil pembayaran" di Modul 5 dan "XOR join dipakai menyinkronkan" di Modul 6 — keduanya titik ajar paling bernilai di seluruh kurikulum.

### WP-9 · Modul 7–9, Cabang S2, dan notasinya

Resep Modul untuk `case-07`, `case-08`, `case-09`, `case-s2`. Notasi: A13, A16, A11, E06, E11, E08, A12, A14, E05, E07 — **10 halaman**.
Khusus: Modul 7 wajib menyatakan tersurat bahwa Subprocess diperkenalkan **karena** model Modul 6 sudah padat (SPEC 5.4 butir 2).

### WP-10 · Modul 10 (Capstone) dan Cabang S1

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-10.1 | **Bangun ulang** model capstone dari nol sebagai `case-10-capstone.bpmn`. Model lama (F-11) hanya mencakup ±12 dari 35 notasi Tier A dan tidak dapat ditambal. | Mencakup seluruh Tier A yang relevan; lolos validator; terbaca pada lebar 360 px lewat collapse |
| T-10.2 | Kunci jawaban 4 lapis untuk capstone; penekanan pada lapis D karena capstone diuji lewat diagnosis (SPEC 5.2). | ≥5 kesalahan umum dengan diagnosis |
| T-10.3 | Bongkar `practice/capstone.mdx` (F-10). | Analisis hanya ada di balik `Reveal` |
| T-10.4 | Cabang S1 (reservasi perjalanan): A15, E10, compensation dalam konteks transaction, ditandai bacaan lanjutan. | Tiga notasi Tier B terbahas di konteks yang wajar |
| T-10.5 | Pensiunkan `case-11-capstone.bpmn` dan arahkan rujukannya. | Tidak ada rujukan tersisa |

### WP-11 · Katalog Tier B/C, referensi, lampiran

| Tugas | Isi |
|---|---|
| T-11.1 | 10 halaman Katalog Tier B dengan Resep 5.3 |
| T-11.2 | 3 baris Tier C |
| T-11.3 | `/katalog/matriks-event` dari `event-matrix.json`, kolom OMG dan Camunda terpisah, seluruh kombinasi |
| T-11.4 | `/katalog/` indeks + `CoverageTable` |
| T-11.5 | `/referensi/anti-pattern` — format gejala → mengapa salah → risiko → perbaikan; panen dari `advanced/index.mdx` |
| T-11.6 | `/referensi/review` — checklist 15 pertanyaan |
| T-11.7 | `/referensi/penamaan` — SPEC 7.4 |
| T-11.8 | `/referensi/token`, `/referensi/membaca-diagram`, `/referensi/validitas` — isi dipanen dari `fondasi/token.mdx` dan `fondasi/apa-itu-bpmn.mdx` |
| T-11.9 | `/lampiran/glosarium` — satu definisi per istilah, tanpa duplikat |
| T-11.10 | `/lampiran/sumber` — seluruh sumber + tanggal periksa; pecah dari `about.mdx` |

### WP-12 · QA, aksesibilitas, performa

| Tugas | Isi | Kriteria terima |
|---|---|---|
| T-12.1 | Pemeriksaan duplikasi, omisi, dan kontradiksi semantik antarhalaman (SPEC `prompt.md` §35–36 yang masih berlaku). | Laporan tanpa temuan terbuka |
| T-12.2 | Audit proporsi tipe soal terhadap SPEC 10.1. | Setiap sel dalam toleransi ±10 poin persen |
| T-12.3 | Lighthouse pada 5 rute perwakilan. | Aksesibilitas ≥90 |
| T-12.4 | Uji keyboard penuh dan satu lintasan pembaca layar. | Semua interaksi dapat dioperasikan |
| T-12.5 | Uji `dist/` di subfolder (`SITE_BASE=/bpmn/`): tautan, aset, `.bpmn`, 404. | Tidak ada aset rusak |
| T-12.6 | Uji perangkat sempit 360 px untuk viewer, berdampingan, dan tabel. | Tidak ada luapan horizontal |
| T-12.7 | Jalankan `test:render` atas seluruh ≥72 file `.bpmn`. | Semua render tanpa galat konsol |

### WP-13 · Go-live

| Tugas | Isi |
|---|---|
| T-13.1 | Vercel: hubungkan repo, build `npm run build`, keluaran `dist`, pratinjau diperiksa |
| T-13.2 | cPanel: build dengan `SITE_BASE` yang sesuai, unggah `dist/`, verifikasi `.htaccess`, 404, dan MIME `.bpmn` |
| T-13.3 | Pemeriksaan akhir atribusi, lisensi CC BY-NC-SA 4.0, surel pemilik, atribusi Camunda dan OMG |
| T-13.4 | `npm run audit:coverage` tanpa pelanggaran dan seluruh 48 baris `VERIFIED` |
| T-13.5 | Tag rilis `v1.0`, catatan rilis |
| T-13.6 | Pasca-rilis: catat daftar tunggu (Panduan Dosen, dwibahasa, Tier C yang didalamkan) di `PROGRESS.md` |

---

## 7. Gerbang mutu

### 7.1 Per tugas
Definisi selesai universal, Bagian 0.3.

### 7.2 Aturan yang ditegakkan `audit-coverage.mjs` (T-1.4)

Setiap aturan yang dilanggar menghasilkan exit non-zero dan pesan yang menyebut entri pelanggarnya.

| ID | Aturan |
|---|---|
| A1 | Setiap entri `elements` punya `tier`, `slug`, dan `status` yang sah; A=35, B=10, C=3 |
| A2 | Setiap notasi Tier A punya `introducedIn` **dan** `reusedIn` ≥1 kasus berbeda (SPEC 13.3) |
| A3 | Setiap notasi Tier A punya `docPath` yang file-nya ada, dan file itu memuat 19 heading bagian |
| A4 | Setiap notasi Tier B punya halaman dengan 7 bagian |
| A5 | `confusedWith` bersifat dua arah |
| A6 | Setiap kasus punya `criteria.json` yang sah, ≥4 kriteria, ≥2 bermode `auto`, ≥2 variasi, ≥3 kesalahan |
| A7 | Total titik reuse negatif di seluruh kurikulum ≥5 |
| A8 | Proporsi tipe soal per rentang modul dalam toleransi SPEC 10.1 |
| A9 | Tidak ada baris `TODO`/`DRAFTED` saat mode `--release` dijalankan |

Selama pembangunan, jalankan tanpa `--release`: A9 dilaporkan sebagai informasi. `npm run verify` memakai mode pembangunan; WP-13 memakai `--release`.

### 7.3 Per rilis
Seluruh DoD SPEC 13.3 — termasuk ≥72 file `.bpmn` yang lolos validator dan render headless, seluruh 48 baris `inventory.json` berstatus `VERIFIED`, CI hijau, Lighthouse aksesibilitas ≥90, dan uji subfolder cPanel lolos.

---

## 8. Risiko pelaksanaan

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Agent menulis semantik BPMN dari ingatan, bukan dari sumber | Materi ajar yang salah, sulit dideteksi pembaca pemula | Larangan 0.4 butir 1; `sources[].locator` wajib; fact-check gate sebelum `VERIFIED` |
| Gaya tiga modul pertama ternyata tidak disetujui pemilik | Sembilan modul berikutnya harus ditulis ulang | Gerbang G2 bersifat mengunci; WP-8 tidak boleh dimulai lebih awal |
| Diagram capstone menjadi tidak terbaca | Alat ukur akhir gagal | Batas keterbacaan SPEC 5.4 butir 3; uji 360 px di T-12.6 |
| Pemeriksa kriteria memberi rasa aman yang salah lewat mode `assisted` | Mahasiswa menyimpulkan modelnya benar padahal belum | Hasil `assisted` wajib disampaikan sebagai dugaan; ≥2 kriteria `auto` per kasus |
| Sel matriks event tidak dapat diverifikasi dari sumber | Matriks tidak lengkap | Tandai eksplisit; jangan mengira-kira; eskalasi ke pemilik |
| `id` elemen tidak dijaga stabil antarversi | `DeltaBlock` dan `TokenSim` pecah | Aturan 3.2; audit perbandingan `id` antarkasus berurutan |
| Volume WP-7..WP-10 membuat mutu menurun di akhir | Modul akhir lebih lemah padahal paling menentukan | Resep 5.1 identik untuk semua modul; audit A1–A9 berjalan di setiap commit |
| Ketidakcocokan Node Windows/WSL terulang | Build gagal, waktu terbuang | Aturan 1.1 dan pemeriksaan `which node` di awal sesi |

---

## 9. Yang sengaja tidak dikerjakan

Sesuai SPEC Bagian 14: Panduan Dosen dan pemetaan 14 pekan, pembahasan prosa seluruh 61 varian event, backend dan akun pengguna, penilaian di server, sinkronisasi progres antarperangkat, dwibahasa, DMN/CMMN/Camunda 7, logo resmi institusi.

Agent yang menemukan kebutuhan atas salah satu dari ini mencatatnya di `PROGRESS.md` bagian daftar tunggu, **tanpa mengerjakannya**.

---

## 10. Urutan kerja yang disarankan untuk sesi pertama

1. Baca `CLAUDE.md`.
2. `which node && node -v` — pastikan Node Linux.
3. T-0.1 sampai T-0.4 secara berurutan. Jangan menyentuh konten sebelum build pertama berhasil.
4. Laporkan output `npm run build` yang sebenarnya, apa pun hasilnya.
5. Lanjutkan WP-0 sampai gerbangnya hijau.

---

## 11. Keputusan pemilik (SELESAI)

Seluruh keputusan sudah dijawab pemilik pada **2026-11-01**. S-01 sampai S-04 telah dituangkan ke `SPEC.md` v1.1, jadi acuan pelaksanaannya adalah SPEC, bukan tabel ini. **Tidak ada lagi tugas yang diblokir.**

| ID | Pertanyaan | Keputusan | Tertuang di |
|---|---|---|---|
| S-01 | Rute `/referensi/token` dan `/referensi/membaca-diagram`? | **Ya** | SPEC 11 |
| S-02 | Rute `/referensi/validitas`? | **Ya** | SPEC 11 |
| S-03 | Minimum 72 file `.bpmn` di DoD? | **Ya** | SPEC 13.3 |
| S-04 | Tiga mode pemeriksaan `auto`/`assisted`/`manual`? | **Ya**, dengan syarat ≥2 kriteria `auto` per kasus | SPEC 9.3 |
| D-01 | Judul situs | **Tetap** "Tutorial BPMN by Pak Tik" | T-6.1 |
| D-02 | Domain produksi | **`bpmn.kodingno.com`** | SPEC 13.3, T-6.4, T-13.1 |
| D-03 | `mermaid` | **Dipertahankan**, wajib lazy-load + alternatif teks | Bagian 3.4, T-2.10 |

Keputusan baru yang muncul selama pelaksanaan dicatat di sini oleh agent — **dan hanya di sini**, bukan di `SPEC.md`. Perubahan `SPEC.md` hanya dilakukan pemilik, atau oleh agent atas perintah tersurat.
