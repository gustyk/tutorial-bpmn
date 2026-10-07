# MASTER PROMPT
## Penyusunan Tutorial Lengkap BPMN 2.0 Berbasis Referensi Camunda untuk Pemula

Anda bertindak sebagai:

1. **pakar Business Process Management (BPM);**
2. **BPMN 2.0 practitioner dan reviewer;**
3. **business process analyst berpengalaman;**
4. **instructional designer untuk pembelajar pemula;**
5. **technical writer berbahasa Indonesia;**
6. **quality assurance reviewer untuk model BPMN;**
7. **researcher yang wajib melakukan verifikasi silang terhadap sumber primer dan sumber resmi.**

Tugas Anda adalah membuat sebuah **tutorial BPMN 2.0 yang sangat lengkap, sistematis, akurat, dan mudah dipahami oleh pemula**, dengan referensi utama:

- Camunda BPMN Reference: https://camunda.com/bpmn/reference/
- Camunda BPMN resources/documentation yang relevan;
- OMG BPMN 2.0.2 Specification sebagai sumber normatif;
- dokumentasi resmi Camunda lainnya apabila diperlukan untuk membedakan antara:
  - BPMN sebagai standar,
  - praktik pemodelan BPMN,
  - BPMN yang dapat dieksekusi,
  - dukungan implementasi Camunda.

Tutorial wajib ditulis dalam **Bahasa Indonesia yang resmi, alami, pedagogis, tetapi tidak kaku**.

---

# 1. TUJUAN AKHIR TUTORIAL

Tutorial harus membawa pembaca dari kondisi:

> “Saya belum memahami BPMN dan hanya melihatnya sebagai flowchart dengan simbol yang banyak.”

menjadi:

> “Saya mampu membaca, membuat, mengevaluasi, dan mempertahankan argumentasi pemilihan suatu notasi BPMN berdasarkan semantik proses bisnis.”

Setelah menyelesaikan tutorial, pembaca minimal harus mampu:

1. memahami filosofi dan konsep dasar BPMN;
2. memahami bagaimana token bergerak dalam model BPMN;
3. membedakan proses, participant, pool, lane, activity, event, gateway, data, artifact, dan connecting object;
4. mengenali **seluruh notasi BPMN yang tercantum dalam referensi Camunda tanpa pengecualian**;
5. memahami arti visual setiap notasi;
6. mengetahui kapan sebuah notasi tepat digunakan;
7. mengetahui kapan notasi tersebut **tidak tepat digunakan**;
8. membedakan beberapa notasi yang secara visual atau konseptual mirip;
9. memahami konsekuensi semantik dari pemilihan simbol;
10. menghindari anti-pattern BPMN;
11. membangun model BPMN sederhana hingga kompleks;
12. melakukan argumentasi mengapa suatu notasi digunakan;
13. mengevaluasi apakah sebuah diagram BPMN valid secara sintaksis dan masuk akal secara semantik;
14. memahami perbedaan antara BPMN untuk:
    - komunikasi bisnis,
    - analisis proses,
    - dokumentasi proses,
    - desain proses,
    - automation/executable process;
15. memahami perbedaan:
    - apa yang dibenarkan oleh standar BPMN;
    - apa yang merupakan best practice;
    - apa yang didukung/tidak didukung oleh Camunda.

---

# 2. PRINSIP UTAMA: JANGAN LANGSUNG MENULIS TUTORIAL

Sebelum menulis tutorial, Anda WAJIB menjalankan fase:

**RESEARCH → INVENTORY → CLASSIFICATION → COVERAGE CHECK → WRITING → VALIDATION**

Jangan melewati satu pun fase tersebut.

---

# 3. FASE 1 — RESEARCH DAN VERIFIKASI SUMBER

Lakukan penelitian menggunakan minimal:

### Sumber primer
1. Camunda BPMN Reference.
2. Dokumentasi resmi Camunda BPMN/Modeler.
3. OMG BPMN 2.0.2 Specification.

Sumber sekunder bereputasi boleh digunakan untuk memperjelas pedagogi, tetapi:

> sumber sekunder tidak boleh mengalahkan sumber primer apabila terjadi perbedaan interpretasi.

Untuk setiap klaim penting mengenai semantik BPMN, lakukan cross-check terhadap minimal satu sumber primer.

Jangan menggunakan blog SEO, artikel generatif, tutorial anonim, atau materi yang tidak dapat diverifikasi sebagai landasan normatif.

---

# 4. BEDAKAN EMPAT JENIS PERNYATAAN

Sepanjang tutorial, bedakan secara eksplisit:

### [STANDARD]
Ketentuan atau semantik yang berasal dari BPMN 2.0.2.

### [CAMUNDA]
Perilaku, implementasi, batasan, atau dukungan khusus Camunda.

### [BEST PRACTICE]
Rekomendasi pemodelan yang meningkatkan readability, maintainability, atau komunikasi.

### [PEDAGOGICAL SIMPLIFICATION]
Penyederhanaan konsep untuk pembelajar pemula.

Jangan pernah menyajikan:

> “praktik Camunda”

seolah-olah merupakan:

> “aturan BPMN”.

Dan jangan menyajikan:

> “best practice”

seolah-olah:

> “kewajiban standar”.

---

# 5. FASE 2 — BUAT MASTER INVENTORY SEMUA NOTASI

Sebelum menulis Bab 1, buat sebuah:

# BPMN NOTATION MASTER INVENTORY

Inventaris harus berasal dari seluruh notasi yang terdapat dalam referensi resmi Camunda yang menjadi lingkup tutorial.

Minimum kelompok utama yang harus diperiksa meliputi:

## A. Participants / Swimlanes
- Pool
- Lane
- participant-related representations yang relevan

## B. Connecting Objects
Teliti dan masukkan seluruh jenis yang relevan, termasuk:
- Sequence Flow
- Conditional Sequence Flow
- Default Sequence Flow
- Message Flow
- Association
- Data Association

serta variasi lain apabila terdapat dalam referensi/spektrum BPMN yang digunakan Camunda.

## C. Activities

### Task
Periksa semua task type, termasuk minimal:
- None/Undefined Task
- Manual Task
- User Task
- Service Task
- Script Task
- Business Rule Task
- Send Task
- Receive Task

dan task type lain apabila ditemukan pada sumber resmi.

### Activity Markers
Periksa:
- Loop
- Multi-instance Sequential
- Multi-instance Parallel
- Compensation

dan kombinasi marker yang sah.

### Subprocess
Periksa seluruh bentuk relevan:
- Embedded Subprocess
- Expanded Subprocess
- Collapsed Subprocess
- Event Subprocess
- Transaction
- Ad-hoc Subprocess
- Call Activity

serta variasi interrupting/non-interrupting jika relevan.

## D. Gateways

Minimal:
- Exclusive Gateway / XOR
- Parallel Gateway / AND
- Inclusive Gateway / OR
- Event-Based Gateway

Teliti juga apakah referensi yang digunakan mencakup:
- Complex Gateway;
- Parallel Event-Based Gateway;
- Exclusive Event-Based Gateway;
- instantiate behavior;

dan jelaskan status dukungan/relevansinya terhadap Camunda.

Jangan menghapus notasi hanya karena jarang digunakan.

## E. Events

Inventaris event harus menggunakan **dua dimensi sekaligus**:

### Dimensi posisi/perilaku
- Start Event
- Intermediate Catch Event
- Intermediate Throw Event
- Boundary Event
- Interrupting Boundary Event
- Non-interrupting Boundary Event
- Event Subprocess Start Event
- Interrupting Event Subprocess
- Non-interrupting Event Subprocess
- End Event

### Dimensi trigger/type

Periksa SEMUA jenis berikut:

- None
- Message
- Timer
- Conditional
- Signal
- Error
- Escalation
- Compensation
- Link
- Cancel
- Terminate
- Multiple
- Parallel Multiple

serta jenis lain apabila ditemukan.

Jangan hanya membahas “Message Event”.

Bahas secara individual kombinasi yang secara BPMN memang memiliki makna berbeda, misalnya:

- Message Start Event;
- Message Intermediate Catch Event;
- Message Intermediate Throw Event;
- Message Boundary Event;
- Non-interrupting Message Boundary Event;
- Message End Event;

karena posisi dan perilakunya mengubah semantik.

Tidak semua event type dapat muncul pada semua posisi.

Buat **Event Compatibility Matrix** yang menunjukkan:

| Event Type | Start | Intermediate Catch | Intermediate Throw | Boundary Interrupting | Boundary Non-interrupting | Event Subprocess | End |
|---|---|---|---|---|---|---|---|

Isi berdasarkan BPMN dan referensi Camunda, bukan asumsi.

## F. Data

Periksa minimal:
- Data Object
- Data Input
- Data Output
- Collection
- Data Store
- Data Association

Jika terdapat state pada Data Object atau bentuk lain yang relevan, jelaskan.

## G. Artifacts

Minimal:
- Text Annotation
- Group

Periksa artifacts lain apabila relevan.

## H. Collaboration / Communication

Pastikan tutorial menjelaskan:
- participant;
- collaboration;
- pool;
- black-box pool;
- white-box pool;
- message flow;
- batas participant;
- komunikasi antarparticipant.

## I. Notasi lain dalam cakupan Camunda

Lakukan pemeriksaan mandiri terhadap referensi resmi.

Apabila ada notasi yang belum termasuk daftar di atas, WAJIB tambahkan.

---

# 6. COVERAGE MATRIX WAJIB

Sebelum penulisan utama, buat tabel:

| ID | Kategori | Notasi | Varian | Sumber Camunda | Sumber BPMN | Akan Dibahas pada Bab | Status |
|---|---|---|---|---|---|---|---|

Status hanya boleh:

- TODO
- DRAFTED
- VERIFIED

Tutorial belum boleh dianggap selesai sebelum:

> **seluruh baris berstatus VERIFIED.**

---

# 7. KATEGORISASI PEDAGOGIS

Jangan mengajarkan notasi berdasarkan urutan alfabet.

Susun berdasarkan tingkat pemahaman.

Gunakan setidaknya empat level:

# Level 1 — Fondasi
Notasi yang harus dikuasai pertama kali.

Misalnya:
- Process
- Pool
- Lane
- Task
- Start Event
- End Event
- Sequence Flow
- XOR
- AND

# Level 2 — Pemodelan Proses Nyata
Misalnya:
- Message Flow
- Message Events
- Timer Events
- Intermediate Events
- Boundary Events
- Subprocess
- Data Object
- Data Store

# Level 3 — Exception, Synchronization, dan Advanced Behavior
Misalnya:
- Inclusive Gateway
- Event-Based Gateway
- Error
- Escalation
- Signal
- Conditional
- Compensation
- Event Subprocess
- Multi-instance
- Transaction
- Terminate

# Level 4 — Specialized / Advanced BPMN
Misalnya:
- Link
- Multiple
- Parallel Multiple
- Ad-hoc
- Call Activity
- Compensation pattern
- specialized event/gateway semantics
- rare but valid BPMN constructs.

Tetap pastikan seluruh notasi akhirnya tercakup.

---

# 8. FORMAT WAJIB UNTUK SETIAP NOTASI

SETIAP NOTASI harus memiliki subsection tersendiri menggunakan template berikut.

# [Nama Notasi]

## 1. Identitas

**Nama resmi BPMN:**  
**Nama Indonesia:**  
**Kategori:**  
**Level pembelajaran:**  
**BPMN element/type:**  

Jika relevan:

**Catching / Throwing:**  
**Interrupting / Non-interrupting:**  
**Executable relevance:**  
**Dukungan Camunda:**  

---

## 2. Gambar Notasi

Sertakan visual simbol BPMN yang benar.

Jika agent mampu membuat gambar SVG sendiri, buat ulang sebagai diagram generik yang sesuai dengan notasi BPMN.

Jangan menyalin gambar berhak cipta secara tidak perlu.

Jika image generation tersedia, berikan prompt visual seperti:

> “Buat ilustrasi teknis minimalis simbol BPMN 2.0 [nama notasi], background putih, stroke hitam, tanpa dekorasi, sesuai bentuk standar BPMN.”

Untuk diagram yang kompleks, gunakan BPMN XML/SVG apabila tersedia.

Di bawah gambar berikan caption:

**Gambar X.X — [Nama notasi].**

---

## 3. Apa Artinya?

Jelaskan secara sederhana untuk pemula.

Gunakan bahasa:

> “Simbol ini berarti...”

bukan hanya definisi standar.

---

## 4. Tujuan

Jelaskan kebutuhan pemodelan yang diselesaikan oleh simbol tersebut.

---

## 5. Semantik BPMN

Jelaskan dengan presisi:

- kapan elemen aktif;
- apa yang memicunya;
- bagaimana token masuk;
- bagaimana token keluar;
- apakah token menunggu;
- apakah token bercabang;
- apakah token disinkronisasi;
- apakah aktivitas dihentikan;
- apakah participant lain terlibat;
- bagaimana scope memengaruhi perilakunya.

---

## 6. Kapan Digunakan?

Berikan kondisi praktis.

Gunakan format:

**Gunakan ketika...**

---

## 7. Kapan Jangan Digunakan?

Gunakan format:

**Jangan gunakan ketika...**

---

## 8. Contoh Penggunaan

Gunakan contoh bisnis Indonesia yang realistis, misalnya:

- pembelian;
- rumah sakit;
- universitas;
- sekolah;
- bank;
- e-commerce;
- pengajuan cuti;
- procurement;
- penerimaan mahasiswa;
- pembayaran;
- layanan pelanggan;
- klaim;
- produksi;
- logistik.

Berikan contoh mini-process.

---

## 9. Diagram Contoh

Buat diagram BPMN sederhana.

Diagram tidak boleh hanya dekoratif.

Diagram harus benar secara BPMN.

---

## 10. Cara Membaca Diagram

Jelaskan diagram langkah demi langkah.

Gunakan perspektif token jika relevan.

---

## 11. Kesalahpahaman Umum

Minimal 2 apabila masuk akal.

Contoh format:

### Salah paham 1
“Parallel Gateway berarti task dijalankan pada CPU secara bersamaan.”

**Mengapa keliru:** ...

### Salah paham 2
“Lane berarti departemen.”

**Mengapa keliru:** ...

---

## 12. Anti-Pattern

Berikan contoh penggunaan notasi yang terlihat masuk akal tetapi sebenarnya keliru atau buruk.

---

## 13. Notasi yang Sering Tertukar

Buat perbandingan misalnya:

| Dibandingkan dengan | Perbedaan utama |
|---|---|
| User Task | ... |
| Manual Task | ... |
| Service Task | ... |

---

## 14. Aturan Pemilihan

Tuliskan dalam bentuk decision rule.

Contoh:

> Jika pekerjaan dilakukan manusia tetapi melalui aplikasi → pertimbangkan User Task.

> Jika aktivitas dilakukan manusia tanpa bantuan workflow engine → pertimbangkan Manual Task.

---

## 15. Pertanyaan Diagnostik

Berikan 2–5 pertanyaan yang dapat ditanyakan modeler.

Misalnya:

> “Apakah proses sedang menunggu kejadian atau melakukan pekerjaan?”

Pertanyaan ini harus membantu menentukan apakah simbol tersebut tepat.

---

## 16. Argumentasi Pemodelan

Berikan contoh pernyataan profesional:

> “Kami menggunakan Message Intermediate Catch Event, bukan Receive Task, karena ...”

Bagian ini WAJIB.

Tujuannya melatih pembaca mempertahankan alasan desain BPMN.

---

## 17. Validity Check

Berikan aturan singkat untuk memeriksa apakah penggunaannya valid.

---

## 18. Camunda Note

Jika relevan jelaskan:

- dukungan execution;
- implementasi Camunda;
- batasan;
- konfigurasi;
- perbedaan dengan BPMN conceptual model.

Jangan masuk terlalu jauh ke kode kecuali diperlukan.

---

## 19. Ringkasan Satu Kalimat

Akhiri dengan:

> **Ingat:** ...

---

# 9. AJARKAN TOKEN SEMANTICS SEJAK AWAL

Tutorial tidak boleh mengajarkan BPMN sekadar sebagai gambar.

Di awal tutorial buat bab khusus:

# Bagaimana Token Bergerak dalam BPMN

Gunakan metafora sederhana, kemudian formalkan.

Pembaca harus memahami:

- token creation;
- token consumption;
- branching;
- synchronization;
- waiting state;
- multiple tokens;
- subprocess scope;
- interruption;
- termination.

Gunakan simulasi seperti:

START
↓
Task A
↓
AND Split
↙       ↘
Task B   Task C
↘       ↙
AND Join
↓
END

Kemudian jelaskan perjalanan token.

---

# 10. TEKANKAN PERBEDAAN PENTING

Buat bagian comparison khusus untuk pasangan-pasangan berikut.

Minimal:

### Flow
- Sequence Flow vs Message Flow
- Sequence Flow vs Association

### Participants
- Pool vs Lane

### Activities
- Task vs Subprocess
- Subprocess vs Call Activity
- User Task vs Manual Task
- Service Task vs Script Task
- Send Task vs Message Throw Event
- Receive Task vs Message Catch Event
- Loop vs Multi-instance

### Gateways
- XOR vs OR
- XOR vs Event-Based Gateway
- AND split vs AND join
- OR join vs AND join
- Gateway split vs conditional sequence flow

### Events
- Start vs Intermediate vs End
- Catch vs Throw
- Interrupting vs Non-interrupting
- Message vs Signal
- Error vs Escalation
- Error vs Terminate
- Timer Event vs Timer Boundary Event
- Boundary Event vs Event Subprocess
- Message Event vs Receive/Send Task
- Multiple vs Parallel Multiple
- Cancel vs Error
- Compensation vs “undo task”

### Data
- Data Object vs Data Store
- Data Association vs Sequence Flow

Buat tabel keputusan jika relevan.

---

# 11. STUDI KASUS BERTAHAP WAJIB

Jangan menunggu sampai seluruh notasi selesai.

Setelah ±3–7 notasi yang secara konseptual saling berkaitan, buat:

# STUDI KASUS INTEGRATIF

Sebisa mungkin gunakan **satu kasus utama yang berkembang secara kumulatif**.

Gunakan contoh:

# “Proses Pemesanan dan Pemenuhan Pesanan pada Toko Online”

### Versi 1
Hanya:
- Start Event
- Task
- Sequence Flow
- End Event.

### Versi 2
Tambahkan:
- XOR Gateway.

### Versi 3
Tambahkan:
- Pool
- Customer
- Message Flow.

### Versi 4
Tambahkan:
- Timer.

### Versi 5
Tambahkan:
- Boundary Event.

### Versi 6
Tambahkan:
- Subprocess.

### Versi 7
Tambahkan:
- Parallel Gateway.

### Versi 8
Tambahkan:
- Error handling.

### Versi 9
Tambahkan:
- Event Subprocess.

### Versi 10
Tambahkan:
- Compensation.

Dan seterusnya.

Apabila sebuah notasi terlalu khusus untuk kasus tersebut, gunakan studi kasus tambahan.

---

# 12. FORMAT STUDI KASUS

Setiap studi kasus harus mempunyai:

## Kasus Bisnis

Narasi singkat.

## Requirement

Apa yang harus dimodelkan.

## Analisis

Identifikasi:
- participant;
- event;
- activity;
- rule;
- exception;
- data;
- timing;
- communication.

## Kandidat Notasi

Jelaskan alternatif.

## Keputusan

Jelaskan notasi yang dipilih.

## Argumentasi

Contoh:

> “XOR digunakan karena hanya satu dari alternatif yang boleh dipilih berdasarkan kondisi data.”

## Diagram

Buat model BPMN.

## Walkthrough Token

Simulasikan token.

## Kesalahan yang Mungkin Dibuat Pemula

Berikan diagram/pseudodiagram salah jika berguna.

## Mengapa Model Alternatif Tidak Dipilih

Bagian ini WAJIB.

---

# 13. DECISION FRAMEWORK

Buat sejumlah decision tree.

Minimal:

# Memilih Activity

Apakah sesuatu merupakan pekerjaan?

→ YA

Siapa/apa yang mengerjakan?

→ Manusia melalui aplikasi → User Task  
→ Manusia tanpa workflow automation → Manual Task  
→ Sistem/service → Service Task  
→ script → Script Task  
→ keputusan DMN/business rule → Business Rule Task  
→ menunggu pesan → Receive Task / Message Catch Event → analisis lebih lanjut

dan seterusnya.

---

# Memilih Gateway

Pertanyaan antara lain:

1. Apakah sedang membagi alur?
2. Apakah kondisi berdasarkan data?
3. Hanya satu jalur?
4. Bisa lebih dari satu?
5. Semua jalur harus berjalan?
6. Keputusan ditentukan kejadian yang terjadi lebih dahulu?

Hasil:
- XOR;
- OR;
- AND;
- Event-Based.

---

# Memilih Event

Buat decision tree berdasarkan:

1. apakah terjadi di awal, tengah, atau akhir;
2. apakah process menerima atau menghasilkan event;
3. apakah activity harus dihentikan;
4. apakah event diarahkan ke participant tertentu;
5. apakah berupa broadcast;
6. apakah exception;
7. apakah escalation;
8. apakah timeout;
9. apakah kondisi data;
10. apakah compensation.

---

# 14. BPMN MODELING HEURISTICS

Setelah seluruh notasi dasar, buat bab:

# Cara Berpikir Seorang BPMN Modeler

Ajarkan pendekatan:

### Langkah 1 — Tentukan scope
Apa proses yang sedang dimodelkan?

### Langkah 2 — Tentukan participant
Siapa yang memiliki proses?

### Langkah 3 — Cari trigger
Apa yang memulai process?

### Langkah 4 — Identifikasi outcome
Apa kondisi selesai?

### Langkah 5 — Identifikasi pekerjaan
Apa yang benar-benar dilakukan?

### Langkah 6 — Temukan decision point
Apa keputusan berbasis data?

### Langkah 7 — Temukan event
Apa yang bisa terjadi di luar kontrol proses?

### Langkah 8 — Temukan concurrency
Apa yang dapat berjalan independen?

### Langkah 9 — Temukan exceptions
Apa yang bisa gagal?

### Langkah 10 — Temukan communication boundary
Siapa bertukar pesan dengan siapa?

### Langkah 11 — Temukan data
Informasi apa yang diperlukan/dihasilkan?

### Langkah 12 — Review semantics
Simulasikan token.

---

# 15. RULE: MODEL BUSINESS SEMANTICS, BUKAN GAMBAR

Selalu ajarkan prinsip:

> “Jangan memilih simbol karena tampilannya cocok. Pilih simbol karena semantiknya cocok dengan realitas bisnis.”

Jika dua simbol menghasilkan gambar mirip tetapi semantiknya berbeda, jelaskan konsekuensinya.

---

# 16. MODELING ARGUMENTATION

Tutorial harus mengajarkan pembaca menjawab pertanyaan:

> “Mengapa Anda menggunakan notasi ini?”

Gunakan pola:

### Context
Apa kondisi bisnis?

### Semantic Requirement
Perilaku apa yang harus dimodelkan?

### Candidate
Apa beberapa simbol yang mungkin?

### Selection
Simbol apa yang dipilih?

### Rejection
Mengapa kandidat lainnya tidak dipilih?

### Consequence
Apa semantik dari keputusan tersebut?

Contoh:

> “Kami menggunakan Event-Based Gateway karena keputusan tidak dapat dibuat berdasarkan data saat gateway dicapai. Proses harus menunggu salah satu dari dua event: pembayaran diterima atau batas waktu pembayaran habis. XOR Gateway tidak dipilih karena XOR membutuhkan evaluasi kondisi berdasarkan informasi yang sudah tersedia ketika gateway dijalankan.”

---

# 17. AJARKAN VALIDITAS DALAM TIGA TINGKAT

Untuk setiap studi kasus, evaluasi:

## 1. Syntactic Validity

Apakah koneksi dan penggunaan elemen diperbolehkan BPMN?

## 2. Semantic Validity

Apakah behavior yang dihasilkan sesuai maksud bisnis?

## 3. Pragmatic Quality

Apakah diagram mudah dipahami manusia?

Tekankan:

> Diagram dapat syntactically valid tetapi tetap buruk atau menyesatkan.

---

# 18. ANTI-PATTERN CATALOG

Buat satu bab khusus anti-pattern.

Minimal bahas:

- menggunakan message flow dalam pool yang sama;
- sequence flow antar-pool;
- menggunakan gateway untuk aktivitas;
- gateway tanpa alasan;
- XOR padahal jalur bisa paralel;
- AND padahal hanya salah satu jalur diperlukan;
- OR join yang tidak dipahami semantiknya;
- event-based gateway diperlakukan seperti XOR;
- lane sebagai urutan waktu;
- mencampur actor dengan department secara tidak konsisten;
- menggunakan data object sebagai task;
- boundary event tanpa memahami interruption;
- menggunakan error untuk setiap hasil negatif;
- menggunakan terminate ketika hanya ingin menyelesaikan satu branch;
- subprocess sebagai kotak dekoratif;
- terlalu banyak event;
- terlalu banyak gateway;
- spaghetti BPMN;
- terlalu banyak crossing line;
- level detail campur aduk;
- nama task tidak menggunakan verb-object;
- nama event seperti aktivitas;
- diagram menjadi flowchart meskipun memakai simbol BPMN.

Untuk setiap anti-pattern:

**Gejala → Mengapa salah → Risiko → Cara memperbaiki.**

---

# 19. NAMING CONVENTION

Ajarkan naming convention.

### Activity
Gunakan:

**Verb + Object**

contoh:

- Verifikasi Pembayaran
- Kirim Invoice
- Periksa Persediaan

Hindari:

- Pembayaran
- Invoice
- Proses Data

### Event

Gunakan state/kejadian.

Contoh:

- Pesanan Diterima
- Waktu Pembayaran Habis
- Pembayaran Gagal

### Gateway

Jika diberi nama, gunakan pertanyaan.

Contoh:

> “Pembayaran valid?”

Outgoing sequence flow:

- Ya
- Tidak.

Jelaskan bahwa konvensi ini best practice, bukan selalu kewajiban BPMN.

---

# 20. GAMBAR DAN DIAGRAM

Tutorial bersifat visual.

Tidak boleh ada penjelasan notasi utama tanpa gambar.

Prioritas pembuatan diagram:

1. BPMN XML yang dapat dibuka di Camunda Modeler, jika lingkungan memungkinkan;
2. SVG yang secara visual sesuai BPMN;
3. Mermaid HANYA jika benar-benar dapat merepresentasikan makna tanpa menyesatkan;
4. image generation untuk ilustrasi konseptual;
5. ASCII hanya untuk menjelaskan logika sementara.

Jangan menggunakan generic flowchart untuk menggantikan BPMN.

---

# 21. FILE BPMN

Jika lingkungan agent memungkinkan membuat file, untuk setiap studi kasus utama buat:

`case-XX-nama-kasus.bpmn`

yang valid dan dapat dibuka menggunakan Camunda Modeler.

Setelah membuat XML BPMN:

1. validasi struktur XML;
2. periksa BPMN namespace;
3. pastikan sequence flow memiliki sourceRef/targetRef benar;
4. pastikan participant/process reference konsisten;
5. jika memungkinkan buka/render model untuk visual inspection.

Jangan mengklaim file valid apabila belum diperiksa.

---

# 22. STRUKTUR TUTORIAL

Gunakan struktur kurang lebih:

# Bagian I — Fondasi BPMN

## Bab 1 — Apa Itu BPMN?
## Bab 2 — Cara Membaca Diagram BPMN
## Bab 3 — Token dan Execution Semantics
## Bab 4 — Struktur Dasar Diagram

# Bagian II — Participants dan Flow

## Pool
## Lane
## Sequence Flow
## Message Flow
## Association
## Data Association

+ studi kasus.

# Bagian III — Activities

## Task
## Semua Task Types
## Activity Markers
## Subprocess
## Call Activity
## Ad-hoc
## Transaction
## Event Subprocess

+ studi kasus kumulatif.

# Bagian IV — Gateways

## XOR
## AND
## OR
## Event-Based
## gateway lain apabila termasuk scope

+ comparison
+ studi kasus.

# Bagian V — Events

## Basic Event Semantics
## Catch vs Throw
## Interrupting vs Non-interrupting

Kemudian seluruh event type satu per satu.

+ compatibility matrix
+ event selection decision tree
+ studi kasus.

# Bagian VI — Data dan Artifacts

Semua notasi data/artifact.

+ studi kasus.

# Bagian VII — Advanced BPMN Patterns

Contoh:

- timeout;
- retry;
- exception handling;
- escalation;
- event race;
- parallel processing;
- synchronization;
- cancellation;
- compensation;
- multiple instance;
- event subprocess;
- request-response;
- fire-and-forget;
- reusable subprocess;
- long-running process.

# Bagian VIII — From Narrative to BPMN

Berikan narasi bisnis mentah lalu modeling step-by-step.

# Bagian IX — BPMN Anti-Patterns

# Bagian X — Model Review

Ajarkan review checklist.

# Bagian XI — Capstone Case

Model besar yang memanfaatkan sebagian besar notasi relevan.

# Lampiran

- BPMN notation catalogue;
- event compatibility matrix;
- gateway selection table;
- task selection table;
- cheat sheet;
- glossary;
- coverage matrix;
- daftar sumber.

---

# 23. CAPSTONE CASE

Di akhir tutorial buat kasus besar.

Contoh:

# Proses Pemenuhan Pesanan E-Commerce

Harus memiliki:

- Customer;
- Merchant;
- Payment Provider;
- Warehouse;
- Shipping Provider.

Scenario minimal:

1. customer membuat order;
2. pembayaran ditunggu;
3. payment timeout;
4. payment berhasil/gagal;
5. stok diverifikasi;
6. beberapa item diproses;
7. fulfillment paralel;
8. shipping;
9. notifikasi;
10. error;
11. escalation;
12. cancellation;
13. refund;
14. compensation;
15. event dari luar proses;
16. data persistence.

Tidak perlu memaksakan simbol yang secara bisnis tidak relevan.

Prinsip utama:

> Jangan mengorbankan kebenaran model demi memasukkan semua simbol dalam satu diagram.

Notasi yang tidak cocok dengan capstone dijelaskan melalui kasus lain.

---

# 24. LATIHAN

Setiap kelompok notasi harus mempunyai latihan.

Gunakan beberapa tipe:

### A. Recognition
“Tentukan jenis simbol berikut.”

### B. Interpretation
“Apa yang akan dilakukan token?”

### C. Error Detection
“Apa yang salah pada diagram ini?”

### D. Selection
“Pilih XOR, OR, AND, atau Event-Based Gateway.”

### E. Modeling
“Buat BPMN berdasarkan narasi berikut.”

### F. Argumentation
“Pertahankan alasan pemilihan notasi Anda.”

---

# 25. QUIZ ARGUMENTASI

Jangan hanya bertanya:

> “Apa simbol Timer Event?”

Gunakan pertanyaan seperti:

> “Customer memiliki waktu 24 jam untuk melakukan pembayaran. Jika pembayaran diterima, proses dilanjutkan. Jika tidak, order dibatalkan. Pilih notasi BPMN yang paling tepat dan jelaskan mengapa XOR Gateway saja tidak cukup.”

Jawaban harus menilai reasoning.

---

# 26. CHECKPOINT KOMPETENSI

Pada akhir setiap bagian beri:

### Anda sudah siap melanjutkan jika mampu:

☐ menjelaskan ...  
☐ membedakan ...  
☐ membuat ...  
☐ menemukan kesalahan ...  
☐ mempertahankan alasan ...

---

# 27. GLOSSARY

Gunakan istilah Indonesia tetapi selalu kenalkan istilah resmi Inggris pertama kali.

Contoh:

> **Aliran Urutan (*Sequence Flow*)**

Setelah itu boleh menggunakan istilah:

> Sequence Flow

apabila lebih umum di komunitas BPMN.

Jangan memaksakan terjemahan yang membuat istilah menjadi ambigu.

---

# 28. STYLE PENULISAN

Gunakan Bahasa Indonesia:

- resmi;
- jelas;
- aktif;
- tidak bertele-tele;
- tidak terasa sebagai terjemahan literal Inggris;
- ramah terhadap pemula;
- tetap presisi secara teknis.

Gunakan pola:

**intuisi → contoh → formal semantics → counterexample.**

Jangan membuka pembahasan dengan definisi formal yang sulit jika konsep dapat dijelaskan secara intuitif terlebih dahulu.

---

# 29. LAYERED EXPLANATION

Untuk konsep kompleks gunakan tiga lapisan:

### Intuisi
“Apa ide sederhananya?”

### Praktik
“Bagaimana digunakan?”

### Formal
“Apa sebenarnya semantik BPMN-nya?”

Dengan demikian pemula tidak kehilangan konteks.

---

# 30. JANGAN MENYEDERHANAKAN HINGGA SALAH

Dilarang membuat pernyataan seperti:

> “Gateway = decision.”

karena tidak semua gateway hanya melakukan decision.

Lebih akurat:

> “Gateway mengendalikan divergensi dan konvergensi Sequence Flow; beberapa gateway merepresentasikan decision, sedangkan lainnya melakukan parallelization atau synchronization.”

Gunakan prinsip tersebut untuk semua konsep.

---

# 31. CAMUNDA VS BPMN STANDARD

Tambahkan box:

> **BPMN ≠ Camunda**

Jelaskan bahwa BPMN merupakan standar OMG sedangkan Camunda adalah platform/modeling/execution environment yang mengimplementasikan subset/perilaku tertentu dari BPMN.

Untuk notasi yang:

- sah dalam BPMN;
- tersedia secara visual di Modeler;
- tetapi tidak executable;
- atau memiliki implementasi tertentu di Camunda,

jelaskan secara eksplisit.

Jangan menghapusnya dari tutorial hanya karena tidak executable.

---

# 32. SUMBER DAN CITATION

Setiap bab harus memiliki rujukan.

Gunakan sumber primer sebanyak mungkin.

Untuk klaim yang bersifat aturan atau semantik:

> berikan citation tepat setelah klaim atau pada paragraf terkait.

Jangan hanya membuat bibliografi panjang tanpa keterkaitan dengan klaim.

Hindari citation kepada sumber yang tidak pernah diverifikasi.

---

# 33. FACT-CHECK GATE

Sebelum sebuah bab dianggap selesai, periksa:

### Completeness
Apakah seluruh notasi dalam scope bab sudah ada?

### Semantics
Apakah perilakunya benar?

### Position
Apakah event type digunakan pada posisi yang diperbolehkan?

### Flow
Apakah Sequence Flow/Message Flow benar?

### Scope
Apakah participant dan subprocess benar?

### Token
Apakah walkthrough token menghasilkan behavior sesuai diagram?

### Example
Apakah contoh bisnis cocok dengan simbol?

### Counterexample
Apakah anti-pattern benar-benar salah atau hanya kurang disukai?

### Standard vs Practice
Apakah standard dan best practice dibedakan?

### Camunda
Apakah klaim implementasi Camunda diverifikasi?

---

# 34. COVERAGE AUDIT AKHIR

Setelah seluruh tutorial selesai, kembali ke:

**BPMN NOTATION MASTER INVENTORY**

Lakukan audit satu per satu.

Buat tabel akhir:

| ID | Notasi | Dibahas | Gambar | Tujuan | Semantics | Contoh | Anti-pattern | Comparison | Case | Sumber | Verified |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|

Semua kolom harus ✔.

Jika ada satu saja yang belum lengkap:

> Tutorial BELUM SELESAI.

Perbaiki sebelum menyerahkan hasil akhir.

---

# 35. DUPLICATE/OMISSION CHECK

Lakukan pemeriksaan otomatis/manual terhadap:

- notasi terduplikasi;
- varian event terlewat;
- marker terlewat;
- event yang dijelaskan hanya secara umum tanpa variasinya;
- gateway langka yang terlewat;
- data/artifact yang terlewat;
- perbedaan interrupting/non-interrupting yang terlewat.

---

# 36. SEMANTIC CONTRADICTION CHECK

Cari kontradiksi di seluruh tutorial.

Contoh:

Bab awal mengatakan:

> “Message Flow hanya antar-pool.”

tetapi diagram berikutnya memakai Message Flow dalam satu pool.

Jika ada:

1. identifikasi;
2. perbaiki;
3. validasi kembali.

---

# 37. DIAGRAM REVIEW CHECK

Untuk setiap diagram tanyakan:

1. Apa participant-nya jelas?
2. Apa scope jelas?
3. Start condition jelas?
4. End condition jelas?
5. Gateway memiliki semantics benar?
6. Message Flow melintasi participant boundary?
7. Sequence Flow tetap dalam process?
8. Event type sesuai posisi?
9. Boundary event melekat pada activity yang benar?
10. Synchronization benar?
11. Ada potensi deadlock?
12. Ada token yang tidak pernah selesai?
13. Ada end state ambigu?
14. Diagram terlalu kompleks?
15. Apakah diagram dapat disederhanakan tanpa kehilangan semantics?

---

# 38. TEACH THE “WHY”

Ukuran keberhasilan tutorial BUKAN:

> “Pembaca hafal semua ikon.”

Ukuran keberhasilan:

> “Pembaca dapat memilih simbol yang tepat dari beberapa alternatif dan menjelaskan alasannya.”

Karena itu setidaknya 30% materi latihan harus menguji:

- pemilihan;
- perbandingan;
- diagnosis;
- argumentasi.

---

# 39. OUTPUT AWAL SEBELUM PENULISAN

JANGAN langsung menghasilkan seluruh tutorial.

Output pertama Anda harus hanya berisi:

## A. Research Notes
Ringkasan sumber yang akan digunakan.

## B. Scope Definition
Definisi tepat apa yang dimaksud dengan “semua notasi BPMN di Camunda”.

## C. BPMN Notation Master Inventory
Daftar lengkap seluruh notasi.

## D. Taxonomy
Pengelompokan notasi.

## E. Coverage Matrix
Mapping setiap notasi ke bab.

## F. Proposed Tutorial Structure
Outline lengkap tutorial.

## G. Case Study Roadmap
Daftar studi kasus dan notasi yang diperkenalkan di masing-masing kasus.

## H. Risk Register Penulisan
Identifikasi risiko seperti:
- notasi terlewat;
- BPMN vs Camunda tercampur;
- diagram invalid;
- explanation oversimplified;
- unsupported Camunda claim.

Baru setelah fondasi tersebut tervalidasi, lanjutkan penulisan tutorial.

---

# 40. DEFINITION OF DONE

Tutorial hanya dianggap selesai jika:

- [ ] seluruh notasi Camunda BPMN Reference sudah diinventarisasi;
- [ ] tidak ada notasi yang terlewat;
- [ ] semua notasi memiliki gambar;
- [ ] semua notasi mempunyai penjelasan tujuan;
- [ ] semua notasi mempunyai semantics;
- [ ] semua notasi mempunyai contoh;
- [ ] semua notasi mempunyai kesalahpahaman/anti-pattern jika relevan;
- [ ] semua notasi mempunyai aturan pemilihan;
- [ ] semua notasi memiliki sumber;
- [ ] event compatibility matrix selesai;
- [ ] decision tree selesai;
- [ ] studi kasus bertahap selesai;
- [ ] capstone selesai;
- [ ] file BPMN tervalidasi apabila dibuat;
- [ ] seluruh claim penting telah di-fact-check;
- [ ] coverage matrix = 100%;
- [ ] semantic contradiction check selesai;
- [ ] tutorial dapat dipahami pemula tanpa mengorbankan akurasi BPMN;
- [ ] pembaca diajarkan bukan hanya “APA simbolnya”, tetapi “KAPAN, MENGAPA, dan APA KONSEKUENSI pemilihannya”.

---

# PERINTAH EKSEKUSI

Sekarang kerjakan **FASE RESEARCH + INVENTORY terlebih dahulu**.

Jangan menulis Bab 1 terlebih dahulu.

Mulailah dengan mengakses dan memeriksa seluruh Camunda BPMN Reference secara sistematis.

Bandingkan dengan OMG BPMN 2.0.2 dan dokumentasi Camunda yang relevan.

Kemudian hasilkan:

1. Research Notes;
2. definisi scope;
3. daftar lengkap notasi;
4. taxonomy;
5. event compatibility matrix awal;
6. coverage matrix;
7. outline tutorial lengkap;
8. roadmap studi kasus;
9. daftar isu/ambiguity yang ditemukan;
10. hasil completeness check.

Di bagian paling akhir tuliskan:

**Coverage sementara: X/Y notasi berhasil diinventarisasi (Z%).**

Jangan menyatakan 100% sebelum seluruh referensi benar-benar diperiksa.