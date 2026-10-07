# BPMN Tutorial Research Pack

Tanggal pemeriksaan: 2026-10-06. Status di sini adalah status riset saat ini, bukan klaim seluruh tutorial selesai.

## A. Research Notes

### Sumber primer yang diperiksa

1. [Camunda BPMN Reference](https://camunda.com/bpmn/reference/) — halaman berhasil diambil. Overview mencantumkan Participants (Pool, Lane), Artifacts (Text Annotation, Group), Gateways (Exclusive, Inclusive, Parallel, Event), Data (Data Object, Data Store), Activities (Task, Subprocess, Call Activity, Event Subprocess, Transaction), dan matriks type/position untuk events. Halaman per bagian yang terlihat mencakup Task Markers, Pool/Collaboration, Subprocess, Call Activity, Ad-hoc, Event Subprocess, gateway, dan event types. Bagian ini menjadi batas utama inventaris; konstruksi yang tidak tampak dalam referensi tetap dimasukkan jika wajib oleh prompt atau BPMN 2.0.2.
2. [Camunda 8.9 BPMN coverage](https://docs.camunda.io/docs/components/modeler/bpmn/bpmn-coverage/) — halaman berhasil diambil. Dokumentasi menjelaskan warna hijau menunjukkan elemen yang didukung untuk eksekusi, tetapi ekstraksi teks tidak mempertahankan warna. Karena itu status runtime per elemen belum ditetapkan berdasarkan warna. Halaman secara eksplisit menyebut DataObject dan DataStore didukung untuk pemodelan saja.
3. [OMG BPMN 2.0.2 specification](https://www.omg.org/spec/BPMN/2.0.2/PDF) — metadata resmi [OMG](https://www.omg.org/spec/BPMN/2.0.2/) mengonfirmasi versi 2.0.2, status formal, tanggal formal 2013-12-09 dan publikasi Januari 2014. PDF dibuka melalui browser dan klausul event terkait (tabel 10.84–10.92, halaman cetak 239–258) diekstrak dengan PDF.js. Posisi top-level start, event-subprocess start, intermediate, boundary, dan end telah dicross-check; cakupan specification lain masih berlangsung.
4. [Camunda 8.9 Data flow](https://docs.camunda.io/docs/components/modeler/bpmn/data-flow/) dan dokumentasi BPMN per elemen — URL sudah diidentifikasi, tetapi ekstraksi beberapa halaman gagal. Rujukan tersebut perlu dibuka/diperiksa ulang pada tahap penulisan sebelum klaim implementasi dibuat.

### Temuan awal yang terdukung

- Camunda Reference menyajikan 8 task type umum: undefined, manual, user, receive, send, script, service, business rule.
- Marker yang dibahas di bagian Task adalah loop, multiple instance, dan compensation; multi-instance memiliki bentuk sequential dan parallel.
- Camunda Reference menekankan boundary event interrupting vs non-interrupting dan event subprocess dengan start trigger interrupting/non-interrupting.
- [STANDARD] Top-level Start Event memiliki tipe None, Message, Timer, Conditional, Signal, Multiple, dan Parallel; embedded Subprocess Start hanya None; Event Subprocess Start memakai daftar trigger khusus (OMG BPMN 2.0.2, tabel 10.84–10.86).
- [STANDARD] None Intermediate Event hanya digunakan pada normal flow sebagai throwing event; boundary event tidak memakai None (tabel 10.89–10.90).
- [STANDARD] Error Event Subprocess selalu interrupting; Compensation Event Subprocess tidak menghentikan process karena dipicu setelah process selesai. Error boundary selalu interrupting, sementara Compensation boundary terjadi setelah activity selesai dan `cancelActivity` tidak berlaku (tabel 10.86, 10.90–10.92).
- [STANDARD] End Event memiliki sembilan hasil: None, Message, Escalation, Error, Cancel, Compensation, Signal, Terminate, Multiple. Parallel Multiple adalah catching-only; tidak ada Parallel Multiple End (tabel 10.88–10.90).
- Timer dan conditional adalah catching event; Link hanya intermediate; Cancel terkait transaction; Terminate adalah end event.
- BPMN dapat dipakai untuk diagram proses yang komunikatif sekaligus cukup presisi untuk diterjemahkan ke komponen software, tetapi BPMN independen dari lingkungan implementasi (pernyataan overview OMG).
- “Modeling support” dan “execution support” adalah status berbeda. Jangan menyimpulkan executable hanya karena elemen dapat digambar.

### Label klaim

- `[STANDARD]`: hanya setelah diperiksa pada BPMN 2.0.2.
- `[CAMUNDA]`: hanya setelah diperiksa pada dokumentasi versi Camunda yang disebutkan.
- `[BEST PRACTICE]`: rekomendasi pemodelan, bukan kewajiban standar.
- `[PEDAGOGICAL SIMPLIFICATION]`: analogi atau pengantar yang secara eksplisit dibatasi.

## B. Scope Definition

“Semua notasi BPMN di Camunda” ditetapkan sebagai union dari: (1) elemen/varian yang tercantum pada Camunda BPMN Reference yang diperiksa pada tanggal di atas; (2) semua elemen wajib dalam daftar prompt, termasuk elemen yang tidak memiliki subhalaman Camunda Reference; dan (3) konstruksi BPMN 2.0.2 yang diperlukan agar diagram serta event compatibility matrix tidak menyesatkan. Inventaris tiap item mencatat sumber Camunda dan sumber normatif secara terpisah. Ruang lingkup tidak sama dengan “semua elemen executable Camunda 8”.

Cakupan event memakai trigger × posisi/perilaku, bukan menghitung ikon semata. Boundary dan event-subprocess starts dibedakan berdasarkan interrupting. Matriks event awal tertera di `inventory.json`; status TODO/DRAFTED/VERIFIED wajib dipertahankan. Tabel overview Camunda dihitung sebagai 61 sel trigger × posisi dan ditampilkan satu per satu di [`catalog.mdx`](../../src/content/docs/events/catalog.mdx). Angka tersebut menghitung sel reference, bukan seluruh kombinasi BPMN 2.0.2 yang mungkin.

## C. BPMN Notation Master Inventory

Sumber data: [`inventory.json`](./inventory.json). Pada snapshot awal: 48 baris elemen, 13 tipe event. Status elemen: 41 DRAFTED, 7 TODO. Event type status terpisah di matriks `events`.

Yang belum diverifikasi sampai ke spesifikasi normatif: kombinasi event yang sah, rincian data input/output, model instantiate gateway, aturan transaction/cancel, complex gateway dan status implementasinya, serta matriks dukungan execution Camunda 8.9.

## D. Taxonomy Pedagogis

### Level 1 — Fondasi
Process, participant/pool, lane, task, start/end event, sequence flow, XOR, AND, collaboration boundary.

### Level 2 — Pemodelan proses nyata
Message flow, message/timer events, intermediate events, boundary events, embedded subprocess, data object/store, association.

### Level 3 — Exception dan sinkronisasi
OR, event-based gateway, error/escalation/signal/conditional, event subprocess, multi-instance, compensation, terminate, data association.

### Level 4 — Specialized/advanced
Complex gateway, parallel event-based gateway, instantiate behavior, transaction/cancel, ad-hoc subprocess, call activity, link, multiple/parallel-multiple events, input/output sets dan advanced compensation patterns.

Taxonomy mengatur urutan pembelajaran, bukan tingkat validitas atau kepentingan elemen.

## E. Event Compatibility Matrix Awal

Dimensi kolom: Start; Intermediate Catch; Intermediate Throw; Boundary Interrupting; Boundary Non-interrupting; Event Subprocess Interrupting; Event Subprocess Non-interrupting; End. Matrix mesin terdapat pada `inventory.json` sebagai daftar `events[].allowed`. Nilai berikut **DRAFTED, bukan VERIFIED**:

| Type | Posisi yang sementara dicatat |
|---|---|
| None | Start, intermediate catch/throw, end |
| Message | Start, intermediate catch/throw, boundary kedua mode, event subprocess kedua mode, end |
| Timer | Start, intermediate catch, boundary kedua mode, event subprocess kedua mode |
| Conditional | Start, intermediate catch, boundary kedua mode, event subprocess kedua mode |
| Signal | Start, intermediate catch/throw, boundary kedua mode, event subprocess kedua mode, end |
| Error | Boundary interrupting, event subprocess interrupting, end |
| Escalation | Intermediate throw, boundary kedua mode, event subprocess kedua mode, end |
| Compensation | Intermediate throw, boundary interrupting, event subprocess interrupting, end (perlu verifikasi normatif) |
| Link | Intermediate catch/throw |
| Cancel | Boundary interrupting dan end dalam konteks transaction |
| Terminate | End |
| Multiple | Start, intermediate catch/throw, boundary kedua mode, event subprocess kedua mode, end |
| Parallel Multiple | Start, intermediate catch, boundary kedua mode, event subprocess kedua mode; catching-only perlu verifikasi |

Jenis event yang tak mendukung posisi tertentu harus diberi tanda em dash pada matriks final dengan sumber yang mendukung keputusan tersebut. Event subprocess satu kolom pada prompt perlu dipecah menjadi interrupting dan non-interrupting agar tak menghapus semantik.

## F. Coverage Matrix

Baris lengkap berada di `inventory.json`. Pemetaan bab: II participants/flow; III activities; IV gateways; V events; VI data/artifacts; VII advanced patterns; bab fondasi dan lampiran membahas process, token, glossary, dan ringkasan. Status saat ini hanya DRAFTED atau TODO; VERIFIED diberikan setelah isi, ilustrasi, semantik, perbandingan, contoh, dan sumber diperiksa.

## G. Tutorial Structure

I. Fondasi BPMN (apa itu BPMN; membaca diagram; token; struktur)  
II. Participants dan Flow (pool/lane; sequence/message flow; association; collaboration)  
III. Activities (task dan delapan jenis; markers; subprocess; call; transaction; ad-hoc; event subprocess)  
IV. Gateways (XOR, AND, OR, event-based, complex; decision framework)  
V. Events (basic semantics; seluruh jenis dan posisi; compatibility matrix; event decision tree)  
VI. Data dan Artifacts  
VII. Advanced BPMN patterns  
VIII. From Narrative to BPMN  
IX. Anti-patterns  
X. Model Review  
XI. Capstone e-commerce  
Lampiran: inventory, matrices, decision tables, cheat sheet, glossary, sources.

## H. Case Study Roadmap

1. Pesanan toko online v1: start, task, sequence flow, end.
2. Pesanan v2: keputusan XOR berdasarkan data.
3. Collaboration customer–merchant: pool dan message flow.
4. Menunggu pembayaran: event-based gateway, message catch, timer.
5. Timeout pada aktivitas: timer boundary dan interrupting/non-interrupting.
6. Pemeriksaan/pemenuhan: embedded subprocess dan data.
7. Pemenuhan paralel: AND split/join dan multi-instance.
8. Kegagalan stok/pembayaran: error handling dan escalation.
9. Perubahan pesanan selama proses: event subprocess.
10. Pembatalan dan refund: transaction/cancel/compensation, hanya bila cocok dengan aturan bisnis.
11. Kasus tambahan untuk notasi tak alami pada e-commerce: ad-hoc subprocess, link, multiple events, complex gateway, data input/output, call activity.
12. Capstone: Customer, Merchant, Payment Provider, Warehouse, Shipping Provider; pembayaran/timeout, stok, item paralel, shipping, notifikasi, error, escalation, cancellation, refund, compensation, external event, persistence.

Setiap case memuat narasi, requirement, analisis, kandidat, keputusan, argumentasi, BPMN diagram, token walkthrough, kesalahan pemula, dan alasan menolak alternatif.

## I. Risk Register

| Risiko | Dampak | Mitigasi |
|---|---|---|
| PDF OMG tidak berhasil diekstrak | Semantik event salah atau matriks tidak lengkap | Buka PDF secara manual/unduh lalu cari tabel; status belum VERIFIED sampai itu dilakukan |
| Pewarnaan execution Camunda hilang saat scraping | Klaim executable salah | Verifikasi tiap elemen pada dokumentasi versi 8.9; gunakan UNKNOWN bila bukti tidak ada |
| Angka 61 varian event tidak berdasar hitung jelas | Coverage palsu | Hitung kombinasi posisi × trigger; definisikan aturan menghitung dalam audit |
| Reference memiliki opini/heuristik | Praktik disajikan sebagai aturan | Tandai BEST PRACTICE dan kutip konteks penulis |
| Istilah Camunda Reference “Termination” vs standar “Terminate” | Glossary membingungkan | Gunakan nama normatif “Terminate End Event”, sebut istilah halaman sebagai alias |
| Embedded subprocess tercampur dengan event subprocess | Model invalid atau semantik salah | Bedakan subprocess biasa dan event subprocess secara eksplisit |
| Diagram dibuat tanpa pemeriksaan BPMN | XML tidak terbuka/token behavior keliru | Validasi parser + bpmn-js render + inspeksi visual |
| Ruang lingkup tutorial terlalu besar untuk satu halaman | UX buruk bagi pemula | Pecah bab, navigasi bertahap, pencarian, ikon, contoh kumulatif |
| Workspace tidak bisa dipakai tool scaffold | Scaffolding otomatis gagal | Buat konfigurasi/file langsung dalam workspace ini; jangan memodifikasi prompt |
| WSL tidak memiliki Node | Tes lokal terblokir | Gunakan Node/npm Windows bila UNC dapat diakses; dokumentasikan bila tidak |

## Completeness Gate Saat Ini

Camunda Reference telah dibaca melalui fetch halaman dan ringkasan section/overview; 61 sel event dihitung dari tabel overview dan dirinci dalam katalog. OMG PDF sudah diperiksa untuk tabel event 10.84–10.92, tetapi full cross-check seluruh notasi dan dokumen Camunda 8.9 belum selesai. Karena itu fase riset/inventory **belum VERIFIED** dan tutorial utama belum layak ditandai selesai. Coverage awal adalah jumlah inventaris hasil ekstraksi, bukan klaim semua semantik sudah tervalidasi.
