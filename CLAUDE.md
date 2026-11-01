# Aturan kerja agent — Tutorial BPMN 2.0 UISI

Proyek ini adalah situs tutorial BPMN 2.0 berbahasa Indonesia untuk mahasiswa Sistem Informasi yang belajar mandiri. Astro 5 + Starlight, keluaran statis, tanpa backend. Domain produksi: `bpmn.kodingno.com`.

## Baca ini dulu, setiap sesi

1. `PROGRESS.md` — tugas mana yang berikutnya.
2. `IMPLEMENTATION-PLAN.md` — bagian Work Package untuk tugas itu.
3. `SPEC.md` — hanya bagian yang dirujuk tugas itu. Jangan membaca seluruhnya setiap sesi.

`SPEC.md` = apa dan mengapa (milik pemilik). `IMPLEMENTATION-PLAN.md` = bagaimana dan urutannya. `GAP-ANALYSIS.md` = kondisi awal per 2026-11-01, dokumen historis, jangan diubah.

## Lingkungan

Direktori ini adalah drive Windows yang dipasang di WSL2. **Jalankan semua `npm` dan `node` di dalam WSL dengan Node Linux.** Periksa dulu:

```bash
which node && node -v    # bukan /mnt/c/..., minimal v20.3
```

Build pernah gagal total karena dijalankan dengan Node Windows terhadap path `\\wsl.localhost\`. Jangan ulangi.

## Gerbang tunggal

```bash
npm run verify    # check → build → validate:bpmn → audit:coverage → test:render → links
```

Sebuah tugas selesai hanya bila `npm run verify` keluar dengan kode 0 **dan outputnya benar-benar dilihat**. Belum ada? Membuatnya adalah tugas T-0.9.

## Larangan keras

1. **Jangan mengarang semantik BPMN.** Pernyataan berlabel `[STANDARD]` wajib membawa pelokasi klausa/tabel OMG BPMN 2.0.2. Tidak bisa diverifikasi → tandai `TODO-VERIFY`, jangan tulis sebagai fakta.
2. **Jangan menaikkan status `VERIFIED`** di `inventory.json` sebelum fact-check gate SPEC 13.4 dijalankan.
3. **Jangan menyentuh file `.bpmn`** tanpa menjalankan `npm run validate:bpmn` sesudahnya.
4. **Jangan mengklaim tampilan benar** tanpa tangkapan layar Playwright.
5. **Jangan mengubah `SPEC.md`.** Butuh perubahan → tulis usulan di `IMPLEMENTATION-PLAN.md` Bagian 11 dan hentikan pekerjaan yang bergantung padanya.
6. **Jangan menambah dependensi** di luar daftar `IMPLEMENTATION-PLAN.md` Bagian 3.4.
7. **Jangan mengerjakan tugas yang statusnya MENUNGGU** di `IMPLEMENTATION-PLAN.md` Bagian 11. Per 2026-11-01 tidak ada yang MENUNGGU — seluruh keputusan pemilik sudah dijawab dan tertuang di `SPEC.md` v1.1.
8. **Jangan melewati gerbang pemilik** G1, G2, G3.

## Enam aturan redaksional (SPEC Bagian 6)

1. Requirement bisnis dulu, notasi kemudian. Jangan pernah membuka bagian dengan "sekarang kita tambahkan Timer Event".
2. Prediksi sebelum pengungkapan: setiap diagram dan simulasi didahului pertanyaan yang jawabannya tersembunyi.
3. "Mengapa alternatif ditolak" wajib ada di setiap keputusan notasi.
4. Reuse negatif: tunjukkan juga di mana notasi lama adalah pilihan **salah**.
5. Jelaskan semantik (pergerakan token, kontrak komunikasi), bukan bentuk simbol.
6. Penyederhanaan wajib berlabel `[PEDAGOGICAL SIMPLIFICATION]` dan tidak boleh membuat pernyataan menjadi salah.

## Bahasa

Nama elemen BPMN tetap bahasa Inggris (*Message Flow*, *Boundary Event*) karena itu yang dilihat mahasiswa di demo.bpmn.io. Seluruh penjelasan bahasa Indonesia. Label di dalam diagram bahasa Indonesia, mengikuti konvensi penamaan SPEC 7.4.

## Commit

Satu tugas = satu commit. Pesan: `WP-x T-x.y: <ringkas>`. Perbarui `PROGRESS.md` di commit yang sama. Commit hanya bila diminta pemilik atau bila tugas itu selesai dan terverifikasi.

## Berhenti dan bertanya bila

(a) tugas memerlukan perubahan `SPEC.md`; (b) gerbang pemilik tercapai; (c) sumber OMG/Camunda tidak dapat diakses sehingga pernyataan tidak terverifikasi; (d) keputusan Bagian 11 belum dijawab; (e) dua kriteria SPEC bertentangan di kasus nyata.

Di luar lima kondisi itu: ambil keputusan sendiri, catat alasannya di `PROGRESS.md`, lanjutkan.
