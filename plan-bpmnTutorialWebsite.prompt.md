## Plan: Website Tutorial BPMN 2.0 untuk Pemula (Tikno, UISI)

Rencana ini mengeksekusi [prompt.md](prompt.md) dalam dua jalur paralel. Jalur pertama adalah riset, inventaris, dan penulisan konten. Jalur kedua adalah membangun website statis Astro + Starlight dengan viewer bpmn-js. Keluaran statis bisa di-deploy ke Vercel Hobby dan ke cPanel. Prompt mewajibkan urutan RESEARCH → INVENTORY → COVERAGE → WRITING → VALIDATION, jadi website baru diisi konten penuh setelah inventaris tervalidasi.

### Temuan awal dari Camunda BPMN Reference
- **Bagian dengan pembahasan sendiri:**
  - Pool, Lane.
  - Task, beserta marker Loop, Multiple Instance, dan Compensation. Ada 8 tipe task.
  - Subprocess, Call Activity, Ad-hoc, Event Subprocess.
  - Gateway XOR, AND, OR, dan Event-based.
  - Event: Basic Concepts, Message, Timer, Error, Conditional, Signal, Termination, Link, Compensation, Multiple, Parallel, Escalation, Cancel.
- **Hanya muncul di tabel overview:** Text Annotation, Group, Data Object, Data Store, dan Transaction.
- **Tidak ada di referensi sama sekali:** Sequence Flow (termasuk conditional dan default), Message Flow, Association, Data Association, Data Input/Output, Collection, Complex Gateway, dan instantiate. Semuanya wajib dilengkapi dari OMG BPMN 2.0.2 dan dokumentasi Camunda (halaman *BPMN coverage* dan *Data flow*), lalu diberi label sumbernya.
- **Grid event di overview:** 61 varian event (13 trigger × posisi). Ini menjadi basis Event Compatibility Matrix.
- **Status dukungan Camunda:** halaman *BPMN coverage* (Camunda 8.9) menandai elemen yang executable dengan warna hijau, dan kolom statusnya belum terbaca dari hasil ambil halaman. Status ini harus diverifikasi manual per elemen. Catatan sementara: DataObject dan DataStore hanya didukung untuk pemodelan, bukan eksekusi.

### Isu atau ambiguitas yang sudah terdeteksi (masuk Risk Register)
1. Referensi menyebut error *catching* hanya sebagai boundary, tetapi grid-nya memuat Error Start EventSub. Perlu disandingkan dengan OMG.
2. Pernyataan "embedded subprocess hanya boleh None start event" tidak boleh dicampur dengan Event Subprocess.
3. Referensi memakai istilah "Termination", sedangkan standar memakai "Terminate".
4. Referensi bersifat opini ("kami tidak pernah memakai Multiple"). Ini harus diberi label [BEST PRACTICE], bukan [STANDARD].
5. Referensi bergaya BPMN 1.2/2.0 lama, jadi perlu dicek terhadap 2.0.2 dan Camunda 8.

---

## Phase 0 — Fondasi riset dan inventaris (memblokir semua fase lain)
1. Ambil dan baca per bagian: Camunda BPMN Reference, halaman *BPMN coverage*, dan dokumen Camunda 8 per elemen (multi-instance, compensation handler, ad-hoc, event subprocess, dan lainnya). Verifikasi silang dengan OMG BPMN 2.0.2 (formal/2013-12-09).
2. Buat `content-src/00-research/` berisi Research Notes, Scope Definition, BPMN Notation Master Inventory, Taxonomy, dan Coverage Matrix. Semua baris awalnya berstatus TODO.
3. Susun Event Compatibility Matrix awal (13 trigger × 7 posisi), diisi dari OMG dan grid Camunda, dengan kolom dukungan Camunda terpisah.
4. Susun Case Study Roadmap, Risk Register, dan hasil completeness check. Tutup dengan baris "Coverage sementara: X/Y notasi (Z%)".
5. **Gerbang tinjauan:** hasil fase ini diserahkan ke pemilik sebelum penulisan massal, sesuai Bagian 39 prompt.

## Phase 1 — Scaffolding website (paralel dengan Phase 0)
6. Inisialisasi Astro + Starlight dengan output `static`, bahasa `id`, Pagefind bawaan, dan dark mode. Tidak ada backend.
7. Hosting: sediakan `vercel.json` untuk Vercel Hobby, dan skrip build yang menghasilkan folder `dist/` untuk di-upload ke cPanel. Sertakan `.htaccess` untuk rewrite dan cache. Gunakan `base` yang dapat dikonfigurasi lewat env, supaya aman bila situs ditaruh di subfolder cPanel.
8. Branding: footer berisi pemilik Tikno (tikno@uisi.ac.id), Universitas Internasional Semen Indonesia, dan lisensi CC BY-NC-SA 4.0. Tanpa logo resmi sampai disediakan. Tambahkan halaman Tentang dan Lisensi serta atribusi sumber (Camunda dan OMG). Gambar dan diagram dibuat ulang sendiri, tidak menyalin SVG Camunda.
9. Desain untuk pemula:
   - tipografi besar dan kontras WCAG AA;
   - navigasi berjenjang sesuai Level 1–4 dengan peta jalur belajar di beranda;
   - sidebar per Bagian I–XI plus Lampiran;
   - callout bertipe untuk [STANDARD], [CAMUNDA], [BEST PRACTICE], dan [PEDAGOGICAL SIMPLIFICATION], lengkap dengan warna dan ikon (tidak bergantung pada warna saja);
   - box "BPMN ≠ Camunda";
   - tooltip glosarium (istilah Indonesia dengan istilah Inggris);
   - responsif dan ramah mobile.

## Phase 2 — Komponen reusable (setelah Phase 1)
10. `NotationCard` untuk template 19 bagian per notasi, sebagai skema frontmatter terstruktur supaya konsisten dan dapat diaudit otomatis.
11. `BpmnViewer` (bpmn-js NavigatedViewer) yang memuat file `.bpmn` dengan zoom dan fullscreen. Tambahkan `TokenSim`, simulasi token sederhana berbasis grafik BPMN, dengan tombol langkah, putar, dan reset. Muat secara lazy.
12. `NotationIcon`: SVG ikon simbol buatan sendiri (stroke hitam, latar putih) untuk seluruh notasi, plus caption "Gambar X.X".
13. `Quiz` (pilihan, benar/salah, deteksi kesalahan, dan argumentasi dengan rubrik) dengan umpan balik, serta `Checkpoint` (checklist kompetensi). Progres disimpan di localStorage.
14. `CoverageTable`, yang dibangun otomatis dari data inventaris.

## Phase 3 — Konten Bagian I–II (setelah Phase 0 disetujui)
15. Bagian I: Bab 1 (apa itu BPMN), Bab 2 (cara membaca diagram), Bab 3 (token dan execution semantics, termasuk simulasi AND split/join), Bab 4 (struktur dasar).
16. Bagian II: Pool, Lane, Sequence Flow (conditional dan default), Message Flow, Association, Data Association, participant (black-box dan white-box), collaboration. Tambahkan perbandingan Pool vs Lane, Sequence vs Message Flow, dan Sequence Flow vs Association, serta studi kasus Versi 1–3.

## Phase 4 — Bagian III–IV (Activities dan Gateways)
17. Task (8 tipe), marker (Loop, Multi-instance Sequential/Parallel, Compensation, dan kombinasinya), Subprocess (embedded, expanded, collapsed), Event Subprocess (interrupting dan non-interrupting), Transaction, Ad-hoc, Call Activity.
18. Gateway XOR, AND, OR, Event-based (termasuk exclusive dan parallel event-based serta instantiate), Complex Gateway. Complex Gateway diberi status "sah di BPMN, tidak executable di Camunda" setelah diverifikasi. Sertakan decision tree Memilih Activity dan Memilih Gateway, serta studi kasus Versi 4–7.

## Phase 5 — Bagian V (Events, bagian terbesar)
19. Semua 61 varian event dibahas satu per satu sesuai template. Posisinya mencakup Start, Intermediate Catch dan Throw, Boundary (interrupting dan non-interrupting), Event Subprocess Start (kedua mode), dan End.
20. Finalisasi Event Compatibility Matrix, decision tree Memilih Event, dan perbandingan wajib: Message vs Signal, Error vs Escalation, Error vs Terminate, Cancel vs Error, Multiple vs Parallel Multiple, dan Compensation vs "undo task". Sertakan studi kasus Versi 8–10.

## Phase 6 — Bagian VI–XI
21. Bagian VI: Data Object (termasuk state), Data Input/Output, Collection, Data Store, Text Annotation, Group.
22. Bagian VII: pola lanjutan (timeout, retry, event race, request-response, fire-and-forget, dan seterusnya).
23. Bagian VIII: From Narrative to BPMN.
24. Bagian IX: katalog anti-pattern (semua poin Bagian 18 prompt, dengan format gejala → mengapa salah → risiko → perbaikan).
25. Bagian X: checklist review (15 pertanyaan Bagian 37).
26. Bagian XI: capstone e-commerce dengan 5 participant, tanpa memaksakan simbol yang tidak relevan.
27. Lampiran: katalog notasi, matriks, cheat sheet, glosarium, coverage matrix, dan daftar sumber. Latihan dan quiz minimal 30% berupa pemilihan, perbandingan, diagnosis, dan argumentasi.

## Phase 7 — File BPMN dan validasi (paralel dengan Phase 3–6)
28. Buat `case-XX-nama-kasus.bpmn` per studi kasus (BPMN 2.0 namespace, `bpmndi` lengkap, sehingga muncul di Modeler). Simpan di `public/bpmn/`.
29. Validasi otomatis lewat skrip Node: parse XML, cek namespace, cek `sourceRef/targetRef`, cek referensi participant ke process, aturan Message Flow antar-pool, dan cek posisi event. Render semua model dengan bpmn-js di headless browser untuk pemeriksaan visual. Jangan mengklaim valid sebelum lolos.
30. Skrip audit otomatis atas frontmatter tiap notasi: 19 bagian lengkap, ada gambar, sumber, contoh, dan perbandingan. Skrip ini menghasilkan tabel Coverage Audit Akhir (Bagian 34). Tambahkan pemeriksaan duplikat, omisi, dan kontradiksi dari Bagian 35–36 sebagai daftar periksa.

## Phase 8 — QA dan rilis
31. Jalankan fact-check gate (Bagian 33) per bab. Status baris coverage naik dari TODO ke DRAFTED lalu VERIFIED, dan situs ditandai selesai hanya bila semua baris VERIFIED.
32. Cek teknis: build statis, Lighthouse (performa, aksesibilitas, SEO), uji tautan, dan uji keyboard. Uji di Vercel preview dan di subfolder cPanel.

## Relevant files (akan dibuat; workspace sekarang hanya berisi [prompt.md](prompt.md))
- `content-src/00-research/*.md` — riset, inventaris, matriks, risk register.
- `src/content/docs/**` — bab dan notasi (MDX).
- `src/components/` — `NotationCard`, `BpmnViewer`, `TokenSim`, `NotationIcon`, `Quiz`, `Checkpoint`, `CoverageTable`, `Callout`.
- `src/data/inventory.json` — satu sumber data untuk coverage matrix dan audit.
- `public/bpmn/case-XX-*.bpmn` — model studi kasus.
- `scripts/validate-bpmn.mjs`, `scripts/audit-coverage.mjs` — validasi dan audit.
- `astro.config.mjs`, `vercel.json`, `public/.htaccess` — konfigurasi build dan hosting.

## Verification
1. Jalankan `npm run build`, pastikan sukses dengan output `dist/` statis.
2. Jalankan `node scripts/validate-bpmn.mjs`, pastikan semua `.bpmn` lolos dan terbuka di bpmn-js tanpa warning.
3. Jalankan `node scripts/audit-coverage.mjs`, pastikan 100% baris VERIFIED dan semua kolom audit ✔.
4. Buka beberapa file `.bpmn` di Camunda Modeler secara manual (sampling).
5. Cek event matrix terhadap grid Camunda dan OMG.
6. Cek Lighthouse ≥ 90 pada aksesibilitas.
7. Deploy preview di Vercel, lalu uji unggah `dist/` ke cPanel, termasuk subfolder.

## Decisions
- Astro + Starlight dipilih karena menghasilkan HTML statis sehingga cocok untuk Vercel Hobby dan cPanel, dan karena Pagefind sudah terintegrasi. Alternatif Docusaurus dan VitePress layak tetapi tidak dipilih.
- Fitur terpilih: quiz, simulasi token, Pagefind, tanpa backend. Progress tracker, dark mode, dan bilingual **tidak** termasuk. Dark mode tetap bawaan Starlight tanpa kerja ekstra.
- Hanya Bahasa Indonesia, lisensi CC BY-NC-SA 4.0, tanpa logo resmi.
- Di luar lingkup: akun pengguna, basis data, dan image generation. Ikon dan diagram dibuat sebagai SVG dan BPMN XML.
- Bagian 39 prompt dihormati: output pertama hanya fondasi riset, bukan seluruh tutorial.

## Further Considerations
1. **Cakupan tahap pertama.** Rekomendasi: eksekusi Phase 0 dan 1 dulu, tinjau bersama, baru lanjut Phase 3 dan seterusnya. Alternatifnya satu eksekusi berkesinambungan, tetapi risiko revisi besar lebih tinggi.
2. **Nama domain dan repositori.** Perlu ditentukan nanti untuk `site`/`base` pada konfigurasi (misalnya subdomain UISI atau domain cPanel Anda).
3. **Versi Camunda acuan.** Rekomendasi: Camunda 8 (dokumen 8.9), dengan catatan [CAMUNDA] terpisah bila perilaku Camunda 7 berbeda.
