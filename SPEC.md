# SPEC — Tutorial BPMN 2.0 untuk Mahasiswa Sistem Informasi

**Status:** AKTIF — sumber kebenaran tunggal proyek ini.
**Versi:** 1.1 · **Tanggal:** 2026-11-01 · **Perubahan v1.1:** amandemen S-01…S-04 dan keputusan D-01…D-03 (lihat Bagian 15)
**Pemilik:** Tikno (tikno@uisi.ac.id), Universitas Internasional Semen Indonesia
**Lisensi konten:** CC BY-NC-SA 4.0

> Dokumen ini mengikat. Bila `prompt.md` bertentangan dengan dokumen ini, **`SPEC.md` yang menang**. `prompt.md` dipertahankan sebagai brief awal dan arsip rasional, bukan spesifikasi kerja. Perubahan ruang lingkup dilakukan dengan mengubah dokumen ini lebih dulu, bukan dengan mengubah konten lebih dulu.

---

## 1. Produk dan audiens

### 1.1 Audiens

Mahasiswa Sistem Informasi yang **sudah memahami konsep dasar proses bisnis** tetapi **belum pernah mengenal BPMN**. Belajar **mandiri**, tanpa pendamping, tanpa dosen yang mengoreksi. Ini berarti setiap latihan harus bisa dinilai sendiri oleh mahasiswa dari materi yang tersedia di situs.

### 1.2 Hasil akhir yang dijanjikan

Setelah menyelesaikan Jalur Belajar, mahasiswa mampu:

1. membaca diagram BPMN dan menelusuri pergerakan token di dalamnya;
2. mengubah narasi proses bisnis menjadi model BPMN yang sah secara sintaksis dan masuk akal secara semantik;
3. memilih notasi berdasarkan **perilaku proses** yang dibutuhkan, bukan berdasarkan kemiripan bentuk simbol;
4. menjelaskan mengapa sebuah notasi dipilih **dan mengapa alternatifnya ditolak**;
5. mendiagnosis kesalahan pada model BPMN milik orang lain maupun miliknya sendiri;
6. membedakan mana yang aturan standar, mana best practice, dan mana batasan Camunda.

### 1.3 Dua produk, satu situs

| Produk | Isi | Sifat | Pembaca |
|---|---|---|---|
| **Jalur Belajar** | 10 modul berurutan + 2 modul cabang, hanya notasi Tier A | Linear, kumulatif, naratif | Pemula, dibaca urut dari awal |
| **Katalog Referensi** | Seluruh 48 notasi + matriks event, Tier A/B/C | Non-linear, dapat dicari | Orang yang sudah belajar dan sedang mencari sesuatu |

Aturan yang mengikat: **Jalur Belajar tidak boleh menjadi katalog.** Bila sebuah notasi tidak punya peran dalam salah satu studi kasus, ia tidak masuk Jalur Belajar — ia masuk Katalog. Kelengkapan ensiklopedis adalah tanggung jawab Katalog, bukan Jalur Belajar.

---

## 2. Sumber kebenaran materi

### 2.1 Hierarki sumber

| Peran | Sumber | Dipakai untuk |
|---|---|---|
| **Normatif** | OMG BPMN 2.0.2 (formal/2013-12-09) | Semantik, posisi event yang sah, aturan sintaksis. Ini pemutus perselisihan. |
| **Primer praktik** | Camunda BPMN Reference (camunda.com/bpmn/reference/) | Visual simbol, penamaan umum di industri, contoh praktik |
| **Dukungan eksekusi** | Camunda 8 docs — BPMN coverage, Data flow | Label [CAMUNDA] tentang apa yang executable |
| **Tooling mahasiswa** | demo.bpmn.io (bpmn.io) | Alat menggambar yang dipakai mahasiswa |

Referensi Camunda bergaya lama, sebagian beropini, dan menandai "tidak didukung" untuk konstruksi yang sah dipakai dalam model analisis. Karena audiens kita memodelkan untuk **komunikasi dan analisis**, bukan otomasi, keterbatasan Camunda **tidak boleh** disajikan sebagai aturan BPMN.

### 2.2 Empat label pernyataan (wajib)

Setiap pernyataan yang bisa diperdebatkan harus berlabel:

- **[STANDARD]** — diatur OMG BPMN 2.0.2. Wajib menyebut klausa/tabel sumbernya.
- **[CAMUNDA]** — perilaku atau batasan implementasi Camunda. Harus menyebut versi (acuan: Camunda 8.9).
- **[BEST PRACTICE]** — konvensi komunitas/penulis. Bukan aturan. Harus menyebut alasannya.
- **[PEDAGOGICAL SIMPLIFICATION]** — penyederhanaan untuk pemula. Wajib menyebut apa yang disembunyikan dan di mana versi lengkapnya.

Aturan tampilan: pada Modul 1–4, callout **[CAMUNDA]** disajikan terkuncup (collapsed) secara default. Pemula tidak boleh terdistraksi oleh batasan engine sebelum paham semantiknya. Pada Modul 5 ke atas dan di Katalog, callout terbuka.

### 2.3 Larangan

- Jangan menyalin SVG atau teks Camunda. Semua ikon dan diagram dibuat sendiri.
- Jangan menyatakan sebuah notasi "tidak ada di BPMN" hanya karena absen dari referensi Camunda.
- Jangan mengklaim sebuah file `.bpmn` valid sebelum lolos `scripts/validate-bpmn.mjs` dan terbuka tanpa warning di bpmn-js.

---

## 3. Bahasa dan istilah

1. **Nama elemen BPMN tetap bahasa Inggris** sebagai istilah utama: *Message Flow*, *Boundary Event*, *Event Subprocess*, *Call Activity*. Alasannya operasional — begitu mahasiswa membuka demo.bpmn.io, label yang dilihatnya berbahasa Inggris.
2. Penjelasan, narasi, analisis, dan argumentasi seluruhnya **bahasa Indonesia**.
3. Terjemahan Indonesia boleh muncul sekali sebagai penjelas pada kemunculan pertama: "Message Flow (alur pesan antarpeserta)". Setelah itu pakai istilah Inggris saja.
4. Istilah proses bisnis dalam kasus memakai bahasa Indonesia yang wajar, bukan terjemahan kaku.
5. Label elemen **di dalam diagram** memakai bahasa Indonesia dengan konvensi penamaan Bagian 7.4 — diagram adalah alat komunikasi bisnis.
6. Satu glosarium tunggal di Lampiran. Setiap istilah hanya punya satu definisi; bila sebuah istilah dijelaskan di dua tempat, salah satunya harus menjadi tautan.

---

## 4. Pembagian Tier notasi

Tiga tingkat kedalaman. Dasar pembagiannya adalah **frekuensi pemakaian nyata** dan **nilai ajar**, bukan kelengkapan.

### 4.1 Tier A — 35 notasi, diajarkan penuh di Jalur Belajar

Template 19 bagian (Bagian 7.1). Wajib muncul di minimal satu studi kasus, dan wajib muncul kembali di minimal satu kasus setelah kasus pengenalannya.

| ID | Notasi | Diperkenalkan di |
|---|---|---|
| P01 | Pool / Participant (white-box & black-box) | Kasus 3 |
| P02 | Lane | Kasus 4 |
| C01 | Collaboration | Kasus 3 |
| F01 | Sequence Flow (normal, conditional, default) | Kasus 1 / 2 |
| F02 | Message Flow | Kasus 3 |
| F03 | Association | Kasus 4 |
| F04 | Data Association | Kasus 4 |
| A01 | Task (bentuk abstrak) | Kasus 1 |
| A02 | None / Undefined Task | Kasus 1 |
| A03 | Manual Task | Kasus 2 |
| A04 | User Task | Kasus 2 |
| A05 | Service Task | Kasus 2 |
| A07 | Business Rule Task | Kasus 2 |
| A08 | Send Task | Kasus 3 |
| A09 | Receive Task | Kasus 3 |
| A11 | Multi-instance Marker (sequential & parallel) | Kasus 7 |
| A12 | Compensation Marker | Kasus 9 |
| A13 | Embedded Subprocess (expanded & collapsed) | Kasus 7 |
| A14 | Event Subprocess (interrupting & non-interrupting) | Kasus 9 |
| A16 | Call Activity | Kasus 7 |
| G01 | Exclusive Gateway (XOR) | Kasus 2 |
| G02 | Parallel Gateway (AND) | Kasus 6 |
| G03 | Inclusive Gateway (OR) | Kasus 6 |
| G04 | Event-Based Gateway | Kasus 5 |
| D01 | Data Object (termasuk state & collection) | Kasus 4 |
| D04 | Data Store | Kasus 6 |
| R01 | Text Annotation | Kasus 4 |
| E01 | None Event (Start, End) | Kasus 1 |
| E02 | Message Event | Kasus 3 |
| E03 | Timer Event | Kasus 5 |
| E05 | Signal Event | Kasus 9 |
| E06 | Error Event | Kasus 8 |
| E07 | Escalation Event | Modul Cabang S2 |
| E08 | Compensation Event | Kasus 9 |
| E11 | Terminate Event | Kasus 8 |

**Posisi event yang masuk Tier A.** Satu tipe event tidak berarti semua posisinya diajarkan. Hanya kombinasi berikut yang dibahas di Jalur Belajar; sisanya menjadi baris Katalog.

| Trigger | Start | Interm. Catch | Interm. Throw | Boundary Interrupt | Boundary Non-interrupt | Event Sub. Start | End |
|---|---|---|---|---|---|---|---|
| None | A | — | — | — | — | — | A |
| Message | A | A | A | A | B | B | A |
| Timer | A | A | — | A | A | B | — |
| Signal | B | A | A | B | B | B | B |
| Error | — | — | — | A | — | A | A |
| Escalation | — | — | A | A | A | A | B |
| Compensation | — | — | A | A | — | B | A |
| Terminate | — | — | — | — | — | — | A |

### 4.2 Tier B — 10 notasi, hanya Katalog

Template 7 bagian (Bagian 7.2). Tidak masuk Jalur Belajar, kecuali Transaction/Cancel yang dibahas di Modul Cabang S1 sebagai bacaan opsional.

| ID | Notasi | Alasan tidak masuk Jalur Belajar |
|---|---|---|
| A06 | Script Task | Urusan developer, bukan analis proses |
| A10 | Loop Marker | Multi-instance lebih sering benar; Loop sering dipakai salah |
| A15 | Transaction Subprocess | Jarang; perlu konteks ACID yang berat untuk pemula |
| A17 | Ad-hoc Subprocess | Jarang; dukungan tooling tidak seragam |
| G05 | Complex Gateway | Sah di BPMN, tidak executable di Camunda, dan selalu ada bentuk yang lebih jelas |
| D02 | Data Input | Relevan untuk model executable, bukan untuk analisis |
| D03 | Data Output | Sama seperti D02 |
| R02 | Group | Dekoratif, tanpa dampak semantik |
| E04 | Conditional Event | Dibahas singkat di Modul Cabang S2 sebagai pembanding Timer |
| E10 | Cancel Event | Hanya bermakna di dalam Transaction Subprocess |

### 4.3 Tier C — 3 notasi, hanya baris matriks

Satu kalimat, satu gambar, dan tautan ke OMG/Camunda. Tidak ada pembahasan.

| ID | Notasi | Catatan |
|---|---|---|
| E09 | Link Event | Alat tata letak, bukan semantik proses |
| E12 | Multiple Event | Jarang dipahami pembaca; umumnya mengurangi keterbacaan |
| E13 | Parallel Multiple Event | Sama seperti E12 |

Seluruh kombinasi posisi×trigger yang tidak disebut di tabel 4.1 tetap wajib terdaftar di **Event Compatibility Matrix** dengan status sah/tidak sah menurut OMG dan dukungan Camunda — kelengkapan dipenuhi di matriks, bukan di prosa.

### 4.4 Konsekuensi untuk `inventory.json`

`content-src/00-research/inventory.json` wajib ditambah field `tier` (`A` | `B` | `C`) dan `introducedIn` (id kasus, atau `null`) pada setiap entri `elements`, serta `tierByPosition` pada setiap entri `events`. Nilainya diambil dari Bagian 4 ini. Tabel coverage, matriks notasi×kasus, dan skrip audit semuanya diturunkan dari file itu — **tidak boleh ada tabel tier yang ditulis tangan di halaman MDX**.

---

## 5. Kurikulum: tangga studi kasus

Menggantikan `prompt.md` §11 (Versi 1–10) sepenuhnya.

### 5.1 Tulang belakang dan cabang

- **Tulang belakang:** satu kasus yang tumbuh kumulatif — *Toko Online: Pesanan dan Pemenuhan Pesanan*. Kasus 1 sampai 10.
- **Cabang:** dua kasus pendek berdomain lain, untuk notasi yang bila dipaksakan ke e-commerce akan menghasilkan model artifisial. Model artifisial mengajarkan pemodelan yang buruk.

### 5.2 Tangga utama

Setiap baris adalah satu modul Jalur Belajar dan satu file `.bpmn`.

| # | Modul / Kasus | Perubahan requirement yang memicu | Notasi baru | Wajib dipakai ulang | Reuse negatif |
|---|---|---|---|---|---|
| 1 | Pesanan diterima sampai dikirim | "Gambarkan alur pesanan kami apa adanya" | E01 (Start/End None), A01, A02, F01, konvensi penamaan, granularitas task | — | — |
| 2 | Order perlu divalidasi | "Pesanan bisa ditolak kalau data tidak lengkap atau barang kosong" | G01 (XOR split/join), conditional & default flow, A03, A04, A05, A07 | 1 | Task bercabang tanpa gateway; XOR join dianggap barrier |
| 3 | Customer adalah pihak luar | "Customer bukan bagian dari kami; kami hanya bertukar pesan" | P01, C01, F02, E02 (Start/Intermediate/End Message), A08, A09 | 1, 2 | Sequence Flow dipakai melintasi Pool; Message Flow dipakai sebagai Sequence Flow |
| 4 | Siapa mengerjakan apa, dan atas data apa | "Tim CS dan tim gudang kerjanya berbeda; dokumen order punya status" | P02, D01 (termasuk state), F04, F03, R01 | 1, 2, 3 | Lane dipakai untuk pihak eksternal; Data Object dipakai sebagai task |
| 5 | Pembayaran ada batas waktu | "Kalau pembayaran tidak masuk dalam 24 jam, pesanan batal" | E03 (Intermediate Timer, Boundary Timer interrupting), G04 | 2, 3 | **XOR dipakai menunggu hasil pembayaran** (data belum ada saat token tiba) |
| 6 | Dua pekerjaan jalan bersamaan | "Invoice dicetak sambil barang disiapkan; keduanya harus selesai" | G02 (AND split/join), G03 (OR + batasannya), D04 | 2, 5 | AND join dihilangkan sehingga hilir jalan dua kali; XOR join dipakai menyinkronkan |
| 7 | Model mulai terlalu padat | "Bagian pemenuhan itu prosedur tersendiri, dan setiap item diproses satu-satu" | A13 (expanded & collapsed), A16, A11 (sequential & parallel) | 4, 6 | Subprocess dipakai hanya untuk merapikan gambar tanpa makna; multi-instance dipakai padahal urutannya tunggal |
| 8 | Pengiriman bisa gagal | "Kalau kurir menolak paket, prosesnya tidak boleh lanjut seolah terkirim" | E06 (Boundary Error, Error End), E11 (Terminate End) | 5, 7 | Error dipakai untuk hasil bisnis yang normal (barang kosong bukan error); Terminate dipakai untuk menutup satu cabang |
| 9 | Pembatalan setelah pembayaran ditarik | "Kalau pesanan batal setelah dana ditarik, dana harus dikembalikan, dan customer boleh menanyakan status kapan saja" | E08 + A12 (Compensation), A14 (Event Subprocess non-interrupting), E05 (Signal) | 3, 5, 8 | Compensation disamakan dengan task "Refund" biasa; Event Subprocess interrupting dipakai padahal proses utama harus tetap berjalan |
| 10 | **Capstone** — kolaborasi 5 participant | Seluruh requirement Kasus 1–9 dalam satu model utuh | **tidak ada** | Seluruh Tier A yang relevan | Diuji lewat soal diagnosis, bukan lewat model referensi |

Kasus 10 sengaja tidak memperkenalkan notasi baru supaya murni menjadi alat ukur. Mahasiswa mengerjakannya tanpa materi baru di hadapannya.

### 5.3 Modul cabang

| ID | Kasus | Posisi | Notasi | Status |
|---|---|---|---|---|
| S1 | Reservasi perjalanan (tiket + hotel harus jadi satu kesatuan) | Setelah Kasus 9 | A15 Transaction, E10 Cancel, Compensation dalam konteks transaction | Opsional, ditandai "bacaan lanjutan" |
| S2 | Pengaduan pelanggan dengan SLA | Setelah Kasus 8 | E07 Escalation, Boundary Timer non-interrupting (pengingat), E04 Conditional sebagai pembanding | Wajib — E07 adalah Tier A |

### 5.4 Aturan pertumbuhan diagram

1. Setiap modul dibuka dengan blok **"Apa yang berubah"**: ringkasan perubahan requirement, lalu daftar elemen yang bertambah dari versi sebelumnya. Elemen baru di-highlight di viewer.
2. Pertumbuhan diagram adalah momen ajar, bukan kecelakaan. Subprocess (Kasus 7) diperkenalkan **karena** model Kasus 6 sudah padat — hubungan sebab itu harus dinyatakan tersurat.
3. Batas keterbacaan: bila satu Pool melewati ±15 elemen alur, pakai collapsed Subprocess. Bila diagram melewati ±35 elemen total, pecah tampilannya menjadi beberapa gambar berfokus.
4. Setiap modul menyediakan diagram versi sebelumnya sebagai pembanding, agar delta bisa dilihat, bukan diingat.

---

## 6. Aturan redaksional yang mengikat

Enam aturan ini adalah pembeda antara tutorial yang mengajarkan pemodelan dan tutorial yang mengajarkan trivia simbol. Pelanggarannya adalah cacat produksi, bukan selera.

1. **Requirement lebih dulu, notasi kemudian.** Urutan setiap modul: perubahan kebutuhan dari stakeholder → pertanyaan *"bagaimana model menyatakan ini?"* → kandidat notasi → keputusan → notasi dijelaskan. **Dilarang** membuka bagian dengan "sekarang kita tambahkan Timer Event".
2. **Prediksi sebelum pengungkapan.** Setiap diagram baru dan setiap simulasi token didahului pertanyaan prediksi yang jawabannya tersembunyi sampai diklik. Mahasiswa harus menebak lebih dulu.
3. **"Mengapa alternatif ditolak" wajib ada** di setiap studi kasus dan di setiap bagian keputusan notasi. Satu paragraf penolakan bernilai lebih besar daripada satu paragraf pembenaran.
4. **Reuse negatif minimal 5 titik** di sepanjang Jalur Belajar (kolom terakhir tabel 5.2 sudah menyediakan 9 kandidat). Tanpa contoh di mana notasi lama adalah pilihan **salah**, mahasiswa akan over-generalisasi notasi yang baru dikuasainya.
5. **Semantik, bukan gambar.** Setiap penjelasan notasi harus menyatakan dampaknya pada pergerakan token atau pada kontrak komunikasi antarpeserta. Penjelasan yang hanya mendeskripsikan bentuk simbol ("belah ketupat dengan tanda X") belum memenuhi syarat.
6. **Tanpa pembulatan yang salah.** Penyederhanaan untuk pemula wajib berlabel [PEDAGOGICAL SIMPLIFICATION] dan menyebut di mana versi lengkapnya. Penyederhanaan yang membuat pernyataan menjadi salah tidak boleh dipakai sekalipun lebih mudah dipahami.

---

## 7. Template wajib

### 7.1 Halaman notasi Tier A — 19 bagian

Memakai struktur `prompt.md` §8 tanpa perubahan: Identitas, Gambar Notasi, Apa Artinya, Tujuan, Semantik BPMN, Kapan Digunakan, Kapan Jangan Digunakan, Contoh Penggunaan, Diagram Contoh, Cara Membaca Diagram, Kesalahpahaman Umum, Anti-Pattern, Notasi yang Sering Tertukar, Aturan Pemilihan, Pertanyaan Diagnostik, Argumentasi Pemodelan, Validity Check, Camunda Note, Ringkasan Satu Kalimat.

Bagian 5 (Semantik) wajib menyebut perilaku token. Bagian 13 (Sering Tertukar) wajib menautkan ke notasi pembandingnya secara dua arah.

### 7.2 Halaman notasi Tier B — 7 bagian

Identitas · Gambar Notasi · Apa Artinya · Kapan Digunakan (dan mengapa jarang) · Sering Tertukar Dengan · Status Camunda · Ringkasan Satu Kalimat.

### 7.3 Baris Tier C

Gambar · satu kalimat arti · satu kalimat alasan tidak dibahas · tautan OMG dan Camunda.

### 7.4 Konvensi penamaan (diajarkan di Kasus 1, ditegakkan di semua diagram)

| Elemen | Pola | Contoh benar | Contoh salah |
|---|---|---|---|
| Task | kata kerja + objek | "Verifikasi data pesanan" | "Verifikasi", "Data pesanan", "Klik tombol simpan" |
| Start Event | kondisi/pemicu yang terjadi | "Pesanan diterima" | "Mulai" |
| End Event | keadaan akhir | "Pesanan terkirim" | "Selesai", "End" |
| XOR Gateway | pertanyaan | "Pembayaran valid?" | "Cek pembayaran" |
| Outgoing flow dari XOR | jawaban | "ya" / "tidak" | tanpa label |
| AND/OR Gateway | tanpa label (atau label netral) | — | "Keputusan" |
| Pool | peran atau organisasi | "Customer", "Payment Provider" | "Proses pembayaran" |
| Lane | peran internal | "Tim Gudang" | "Gudang mengemas barang" |

Granularitas task: satu task = satu unit kerja bermakna bagi bisnis yang dikerjakan oleh satu peran dalam satu rentang waktu. Interaksi antarmuka ("klik", "isi field") bukan task.

### 7.5 Studi kasus — struktur halaman

Bagian 1–6 tampil terbuka. Bagian 7 tersembunyi sampai mahasiswa mengklik "Lihat kunci jawaban".

1. **Apa yang berubah** — delta requirement dan delta notasi dari modul sebelumnya.
2. **Kasus bisnis** — narasi, ditulis sebagaimana stakeholder bicara, bukan sebagaimana modeler berpikir.
3. **Requirement** — daftar bernomor yang bisa diperiksa satu per satu.
4. **Panduan analisis** — pertanyaan terbimbing (participant, trigger, outcome, pekerjaan, keputusan, event, concurrency, exception, data), **tanpa jawaban**.
5. **Tugas** — apa yang harus digambar, plus tautan ke alat gambar dan ke file starter `.bpmn` bila ada.
6. **Pemeriksa kriteria** — alat self-check otomatis (Bagian 9.3).
7. **Kunci jawaban 4 lapis** (Bagian 8).

Perbedaan penting dari konten yang ada sekarang: halaman `practice/narrative.mdx` dan `practice/capstone.mdx` saat ini langsung menyajikan analisis dan keputusannya. Keduanya harus dibongkar mengikuti struktur ini — analisis pindah ke lapis kunci jawaban.

---

## 8. Kunci jawaban 4 lapis

Model BPMN tidak punya jawaban tunggal. Menyajikan satu model sebagai "jawaban benar" menyebabkan dua kegagalan: mahasiswa yang modelnya berbeda-tapi-benar menyimpulkan dirinya salah, dan mahasiswa yang modelnya mirip-tapi-salah-semantik menyimpulkan dirinya benar. Karena itu yang menentukan benar/salah adalah **lapis B**, bukan kemiripan gambar dengan lapis A.

### Lapis A — Model referensi

Satu file `.bpmn` yang lolos validasi, ditampilkan di `BpmnViewer`, disertai walkthrough token langkah demi langkah.

### Lapis B — Kriteria wajib (penentu)

4 sampai 7 pernyataan **semantik** yang harus dipenuhi model apa pun agar dinyatakan benar. Kriteria berbicara tentang perilaku, bukan tentang penempatan simbol.

Contoh yang memenuhi syarat (Kasus 5):
> "Batas waktu pembayaran diekspresikan sebagai event yang menunggu — Boundary Timer atau Event-Based Gateway — bukan sebagai XOR atas data status pembayaran, karena pada saat token tiba data itu belum ada."

Contoh yang **tidak** memenuhi syarat:
> "Ada Timer Event di diagram." (menguji keberadaan simbol, bukan semantik)

Setiap kriteria mencantumkan: `id`, pernyataan, cara periksa (otomatis/manual), dan tautan ke halaman materi yang harus dibaca ulang bila kriteria tidak terpenuhi.

### Lapis C — Variasi yang juga diterima

Minimal dua model alternatif yang tetap memenuhi seluruh kriteria lapis B, disertai trade-off-nya. Contoh: Boundary Timer pada Receive Task versus Event-Based Gateway dengan dua cabang — keduanya sah di Kasus 5, konsekuensinya berbeda pada keterbacaan dan pada perlakuan terhadap task yang dibatalkan.

### Lapis D — Kesalahan umum

Minimal tiga model salah, masing-masing dengan: file `.bpmn` atau diagram salahnya, gejala yang terlihat, diagnosis semantiknya ("token akan menunggu selamanya karena..."), dan perbaikannya. Diambil dari kolom reuse negatif tabel 5.2 dan dari katalog anti-pattern.

### Tata letak file

```
content-src/cases/case-05-batas-waktu/
  case.md            # narasi, requirement, panduan analisis, tugas
  criteria.json      # lapis B, dapat dibaca mesin
  solution.bpmn      # lapis A
  variants/*.bpmn    # lapis C
  mistakes/*.bpmn    # lapis D
  solution.md        # walkthrough token, argumentasi, penolakan alternatif
```

`criteria.json` adalah satu-satunya sumber kriteria. Halaman MDX, pemeriksa otomatis, dan skrip audit ketiganya membacanya dari file itu.

---

## 9. Alat yang dipakai mahasiswa

### 9.1 Alat menggambar: demo.bpmn.io

Keputusan final: **demo.bpmn.io**. Tanpa pemasangan, tanpa akun, tanpa biaya, dan mesin render-nya sama dengan `bpmn-js` yang dipakai situs ini sehingga tampilan konsisten.

Halaman onboarding wajib memuat: cara membuat diagram baru, palet dan context pad, cara memasang Boundary Event (titik yang paling sering membuat pemula gagal), cara menambah Pool/Lane dan Message Flow, cara menyimpan `.bpmn` ke komputer, cara membukanya kembali, dan peringatan bahwa pekerjaan tidak tersimpan otomatis di server.

### 9.2 "Muat model Anda"

Komponen yang membuka file `.bpmn` milik mahasiswa dari komputernya dan menampilkannya **berdampingan** dengan model referensi, dengan zoom tersinkron bila memungkinkan. Seluruh pemrosesan terjadi di browser; tidak ada unggahan ke server. Situs ini statis dan tidak punya backend — nyatakan ini ke mahasiswa sebagai jaminan privasi.

### 9.3 Pemeriksa kriteria

Memeriksa file `.bpmn` mahasiswa terhadap `criteria.json` kasus yang bersangkutan, seluruhnya di browser.

Kosakata aturan yang perlu didukung:

| Aturan | Memeriksa |
|---|---|
| `element-exists` | ada elemen bertipe tertentu (opsional: dengan jumlah minimum) |
| `boundary-attached-to` | Boundary Event menempel pada activity bertipe/berlabel tertentu |
| `boundary-interrupting` | Boundary Event bersifat interrupting atau non-interrupting |
| `no-sequence-flow-across-participants` | tidak ada Sequence Flow melintasi batas Pool |
| `message-flow-between-participants` | ada Message Flow antara dua participant tertentu |
| `gateway-split-labeled` | setiap outgoing flow dari XOR punya kondisi atau default |
| `gateway-join-type` | tipe gateway join sesuai tipe split-nya |
| `marker-on-activity` | marker (multi-instance/compensation/loop) terpasang pada activity |
| `compensation-has-handler` | setiap Compensation throw punya handler yang dapat dijangkau |
| `all-tokens-reach-end` | tidak ada jalur yang berakhir tanpa End Event |
| `subprocess-start-event` | Embedded Subprocess memakai None Start Event |

**Tiga mode pemeriksaan (mengikat).** `id` elemen pada model mahasiswa tidak dapat diprediksi, sehingga tidak semua kriteria dapat diperiksa dengan tingkat kepercayaan yang sama. Setiap kriteria wajib menyatakan modenya:

| Mode | Cara kerja | Cara menyampaikan hasil |
|---|---|---|
| `auto` | Struktural, tidak bergantung pada label yang ditulis mahasiswa. Hasilnya dapat dipercaya. | "Terpenuhi" / "Belum terpenuhi" |
| `assisted` | Memakai heuristik pencocokan nama elemen untuk menemukan activity yang dimaksud. | **Wajib** disampaikan sebagai dugaan, disertai catatan agar mahasiswa memastikan sendiri |
| `manual` | Tidak diperiksa mesin. | "Perlu diperiksa sendiri", disertai pertanyaan pemandu |

Setiap kasus wajib memuat **minimal 2 kriteria bermode `auto`**, supaya self-check punya nilai nyata dan bukan hanya daftar pertanyaan.

**Kebijakan pelaporan (mengikat):** hasil disajikan sebagai **"kriteria terpenuhi / belum terpenuhi"** dengan tautan bacaan, **bukan** sebagai skor, persentase, nilai, atau putusan lulus/gagal. Kriteria yang tidak bisa diperiksa otomatis ditandai "perlu diperiksa sendiri" dan disertai pertanyaan pemandu. Pemeriksa ini alat belajar, bukan penilai.

---

## 10. Latihan dan asesmen

### 10.1 Enam tipe soal dan proporsinya

| Tipe | Menguji | Modul 1–4 | Modul 5–7 | Modul 8–10 |
|---|---|---|---|---|
| Recognition | mengenali simbol | 30% | 10% | 0% |
| Interpretation | membaca diagram, menelusuri token | 35% | 25% | 15% |
| Error Detection | menemukan dan mendiagnosis kesalahan | 15% | 25% | 30% |
| Selection | memilih notasi untuk kebutuhan tertentu | 10% | 20% | 20% |
| Modeling | menggambar model | 10% | 15% | 20% |
| Argumentation | membela pilihan, menolak alternatif | 0% | 5% | 15% |

Pergeseran dari mengenali ke memutuskan adalah inti kurikulum ini. Gabungan Selection + Error Detection + Argumentation wajib ≥30% sepanjang Jalur Belajar.

### 10.2 Aturan

1. Setiap halaman notasi Tier A punya minimal **3 soal**. Satu soal per halaman tidak memenuhi syarat — kondisi sekarang (1 soal di beberapa halaman) adalah kekurangan yang harus ditutup.
2. Setiap modul ditutup **Checkpoint Kompetensi**: 4–6 pernyataan "saya mampu..." dengan tautan bacaan ulang. Disimpan di `localStorage`.
3. Soal Argumentation dinilai dengan **rubrik mandiri** 3 poin: konteks dan kebutuhan semantik disebut; notasi terpilih dikaitkan ke kebutuhan itu; minimal satu alternatif ditolak dengan alasan semantik.
4. Soal Error Detection memakai file `.bpmn` yang benar-benar salah, bukan gambar yang dinarasikan salah.
5. Semua umpan balik menjelaskan **mengapa** jawaban lain salah, bukan hanya menandai mana yang benar.

---

## 11. Struktur situs

```
/                         Beranda — janji hasil belajar + titik masuk
/jalur-belajar            Peta 10 modul + 2 cabang, dengan status progres
/alat/menggambar          Onboarding demo.bpmn.io
/alat/periksa-model       "Muat model Anda" + pemeriksa kriteria (umum)
/jalur/01 … /jalur/10     Modul Jalur Belajar (satu modul = satu kasus)
/jalur/s1, /jalur/s2      Modul cabang
/notasi/<slug>            Halaman notasi Tier A (19 bagian)
/katalog/                 Indeks Katalog Referensi + tabel coverage
/katalog/<slug>           Notasi Tier B (7 bagian) dan baris Tier C
/katalog/matriks-event    Event Compatibility Matrix lengkap
/referensi/token          Semantik token: bagaimana token bergerak
/referensi/membaca-diagram  Cara membaca diagram BPMN
/referensi/validitas      Tiga tingkat validitas: syntactic, semantic, pragmatic
/referensi/anti-pattern   Katalog anti-pattern
/referensi/review         Checklist review model 15 pertanyaan
/referensi/penamaan       Konvensi penamaan
/lampiran/glosarium       Glosarium tunggal
/lampiran/sumber          Sumber dan atribusi
/tentang                  Pemilik, lisensi, atribusi
```

Konten yang ada sekarang (`fondasi/`, `participants/`, `activities/`, `gateways/`, `events/`, `data/`, `advanced/`, `practice/`) dipindahkan: materi per-notasi ke `/notasi/`, materi bergaya katalog ke `/katalog/`, dan `practice/*` dibongkar ke `/jalur/`. Tidak ada halaman lama yang dipertahankan dalam bentuk sekarang — semuanya bergaya ringkasan referensi, bukan tutorial bertahap. Pasang redirect untuk URL lama.

Komponen: `BpmnViewer` (sudah ada, tambah highlight elemen baru dan mode berdampingan), `TokenSim`, `Quiz` (tambah tipe error-detection dan argumentation-rubric), `NotationCard`, `NotationIcon`, `CoverageTable`, `CriteriaChecker`, `Checkpoint`, `Callout`, `DeltaBlock`, `Reveal`.

---

## 12. File BPMN

1. Namespace BPMN 2.0 lengkap, dengan `bpmndi` penuh sehingga file terbuka benar di demo.bpmn.io dan Camunda Modeler.
2. Penamaan: `case-NN-<slug>.bpmn` untuk model referensi, `case-NN-variant-<slug>.bpmn`, `case-NN-mistake-<slug>.bpmn`.
3. Model referensi kasus N harus merupakan **superset** model kasus N-1 bila sifatnya kumulatif, sehingga delta bisa dihitung dan di-highlight otomatis.
4. Label elemen bahasa Indonesia mengikuti Bagian 7.4.
5. `id` elemen stabil antarversi, agar delta antarkasus dapat dihitung dengan membandingkan `id`.
6. Setiap file lolos `scripts/validate-bpmn.mjs` dan di-render headless tanpa warning sebelum dipublikasikan.

---

## 13. Validasi dan Definition of Done

Menggantikan `prompt.md` §40.

### 13.1 Per notasi

- **Tier A:** 19 bagian lengkap; gambar sendiri; minimal 3 soal; terdaftar di minimal 1 studi kasus sebagai pengenalan **dan** minimal 1 kasus berikutnya sebagai pengulangan; tautan dua arah ke notasi yang sering tertukar; label sumber pada setiap pernyataan yang bisa diperdebatkan.
- **Tier B:** 7 bagian lengkap; gambar sendiri; alasan "jarang dipakai" dinyatakan.
- **Tier C:** baris matriks lengkap dengan tautan sumber.

### 13.2 Per studi kasus

- Keempat lapis kunci jawaban ada dan lengkap (B minimal 4 kriteria, C minimal 2 variasi, D minimal 3 kesalahan).
- `criteria.json` valid terhadap skema dan setiap kriteria punya tautan bacaan.
- Blok "Apa yang berubah" ada, kecuali Kasus 1.
- Walkthrough token ada.
- Bagian "mengapa alternatif ditolak" ada.
- Seluruh file `.bpmn` terkait lolos validator.

### 13.3 Per produk

- Setiap notasi Tier A muncul di minimal 2 kasus (pengenalan + pengulangan) — diaudit otomatis dari `inventory.json`.
- Minimal 5 titik reuse negatif terpasang dan terdaftar.
- Proporsi tipe soal memenuhi tabel 10.1 (±10 poin persen per sel).
- Event Compatibility Matrix memuat seluruh kombinasi posisi×trigger dengan status OMG dan Camunda terpisah.
- Minimal **72 file `.bpmn`** (12 model referensi + ≥24 variasi + ≥36 kesalahan) lolos `scripts/validate-bpmn.mjs` dan lolos render headless tanpa galat konsol.
- Seluruh baris `inventory.json` berstatus `VERIFIED`; tidak ada `TODO`/`DRAFTED` yang tersisa.
- `npm run build` sukses menghasilkan `dist/` statis; `node scripts/validate-bpmn.mjs` dan `node scripts/audit-coverage.mjs` hijau.
- Lighthouse aksesibilitas ≥90; seluruh tautan internal hidup; navigasi keyboard berfungsi; callout tidak bergantung pada warna saja.
- Terpasang di Vercel pada domain `bpmn.kodingno.com`, dan teruji juga di subfolder cPanel.

### 13.4 Fact-check gate per halaman

Sebelum status naik dari `DRAFTED` ke `VERIFIED`, periksa: kelengkapan bagian, kebenaran semantik terhadap OMG, posisi event yang sah, aturan koneksi, batas scope, perilaku token, keberadaan contoh dan contoh-kebalikan, pemisahan standar versus praktik, dan ketepatan catatan Camunda beserta versinya.

---

## 14. Di luar lingkup

- **Panduan Dosen dan pemetaan 14 pekan** — ditunda. Fokus rilis ini adalah belajar mandiri. Jangan menulis materi yang mengandaikan kehadiran dosen.
- Pembahasan satu-per-satu seluruh 61 varian event dalam prosa. Kelengkapan dipenuhi lewat Event Compatibility Matrix.
- Backend, akun pengguna, basis data, penilaian di server, sinkronisasi progres antarperangkat. Progres hanya `localStorage`.
- Dwibahasa. Hanya bahasa Indonesia.
- Pembahasan DMN, CMMN, Camunda 7, dan konfigurasi engine.
- Logo resmi institusi, sampai disediakan pemilik.

---

## 15. Perubahan terhadap `prompt.md`

| Bagian `prompt.md` | Status | Penggantinya |
|---|---|---|
| §5 Master Inventory | Diperluas | Bagian 4 — ditambah Tier A/B/C dan `introducedIn` |
| §7 Kategorisasi pedagogis Level 1–4 | Diganti | Bagian 5 — 10 modul berbasis kasus |
| §8 Template 19 bagian | Dipersempit | Bagian 7.1 — hanya untuk Tier A; Tier B memakai 7 bagian |
| §11 Studi kasus Versi 1–10 | Diganti total | Bagian 5.2 dan 5.3 |
| §12 Format studi kasus | Diperluas | Bagian 7.5 dan 8 — ditambah kriteria wajib, variasi, dan pemisahan kunci jawaban |
| §22 Struktur tutorial Bagian I–XI | Diganti | Bagian 11 |
| §23 Capstone | Dipertahankan, diposisikan ulang | Kasus 10, tanpa notasi baru |
| §24–26 Latihan, quiz, checkpoint | Diperkuat | Bagian 10 — ditambah proporsi per modul |
| §40 Definition of Done | Diganti | Bagian 13 |
| Lainnya (§1–4, 6, 9, 10, 13–21, 27–39) | Berlaku | Tetap mengikat sejauh tidak bertentangan dengan dokumen ini |

### Keputusan yang sudah diambil

| Tanggal | Keputusan |
|---|---|
| 2026-11-01 | Jalur Belajar dipisahkan dari Katalog Referensi; notasi dibagi Tier A/B/C |
| 2026-11-01 | Tangga Versi 1–10 diganti dengan 10 kasus + 2 modul cabang; Pool/Message Flow naik ke Kasus 3 |
| 2026-11-01 | Kunci jawaban berbentuk 4 lapis; penentu kebenaran adalah kriteria semantik, bukan kemiripan dengan model referensi |
| 2026-11-01 | Alat menggambar mahasiswa: demo.bpmn.io |
| 2026-11-01 | Fokus belajar mandiri; Panduan Dosen ditunda |
| 2026-11-01 | OMG BPMN 2.0.2 normatif untuk semantik; Camunda primer untuk visual dan praktik |
| 2026-11-01 | **S-01** Tambah rute `/referensi/token` dan `/referensi/membaca-diagram` (Bagian 11) |
| 2026-11-01 | **S-02** Tambah rute `/referensi/validitas` (Bagian 11) |
| 2026-11-01 | **S-03** Minimum 72 file `.bpmn` masuk Definition of Done (Bagian 13.3) |
| 2026-11-01 | **S-04** Pemeriksa kriteria memakai tiga mode `auto`/`assisted`/`manual`; ≥2 kriteria `auto` per kasus (Bagian 9.3) |
| 2026-11-01 | **D-01** Judul situs tetap "Tutorial BPMN by Pak Tik" |
| 2026-11-01 | **D-02** Domain produksi: `bpmn.kodingno.com`; nilai `site` Astro mengikutinya |
| 2026-11-01 | **D-03** `mermaid` dipertahankan untuk decision tree, wajib lazy-load dan wajib punya alternatif teks |

---

## 16. Urutan pekerjaan berikutnya

1. Tambahkan `tier`, `introducedIn`, dan `tierByPosition` ke `inventory.json`; perbarui `scripts/audit-coverage.mjs` agar mengaudit aturan Bagian 13.3.
2. Tetapkan skema `criteria.json` dan tulis `criteria.json` + `solution.bpmn` untuk Kasus 1–3.
3. Bangun kerangka rute Bagian 11 beserta redirect dari URL lama.
4. Bangun komponen `DeltaBlock`, `Reveal`, dan `CriteriaChecker`.
5. Tulis Modul 1–3 lengkap dengan keempat lapis kunci jawaban sebagai purwarupa mutu, lalu tinjau bersama pemilik sebelum melanjutkan Modul 4–10.
6. Bongkar konten lama ke `/notasi/` dan `/katalog/` mengikuti Tier.
