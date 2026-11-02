import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

// Make GFM task-list checkboxes invisible to screen readers (decorative, text conveys info)
function rehypeTaskListA11y() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'input' && node.properties?.type === 'checkbox' &&
          'disabled' in (node.properties ?? {})) {
        node.properties['aria-hidden'] = 'true';
        node.properties.tabindex = '-1';
      }
    });
  };
}

const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  output: 'static',
  site: 'https://bpmn.kodingno.com',
  base,
  redirects: {
    // Internal Astro index redirects
    '/gateways/index': '/gateways/',
    '/events/index': '/events/',
    '/data/index': '/data/',
    '/advanced/index': '/advanced/',
    // T-6.2: rute lama → rute baru.
    // Redirects content-migration (fondasi/, participants/, activities/, practice/) ditunda ke WP-7
    // saat konten benar-benar dipindahkan ke jalur baru.
    '/about': '/tentang',
    '/events/catalog': '/katalog/',
    '/events/matrix': '/katalog/matriks-event',
    '/practice/review': '/referensi/review',
    '/advanced/': '/referensi/anti-pattern',
    // T-7.0: practice/narrative kontennya sudah dipindahkan ke jalur/01-03
    '/practice/narrative': '/jalur/01',
  },
  markdown: {
    rehypePlugins: [rehypeTaskListA11y],
  },
  integrations: [sitemap(), starlight({
    title: 'Tutorial BPMN by Pak Tik',
    description: 'Tutorial BPMN 2.0 berbahasa Indonesia untuk memahami semantik proses.',
    defaultLocale: 'root',
    locales: { root: { label: 'Bahasa Indonesia', lang: 'id' } },
    customCss: ['./src/styles/custom.css'],
    components: { Footer: './src/components/Footer.astro' },
    sidebar: [
      { label: 'Mulai', items: [
        { label: 'Beranda', link: '/' },
        { label: 'Peta belajar', link: '/jalur-belajar' },
      ]},
      { label: 'Jalur belajar', items: [
        { label: 'Modul 1 — Pesanan diterima sampai dikirim', link: '/jalur/01' },
        { label: 'Modul 2 — Order perlu divalidasi', link: '/jalur/02' },
        { label: 'Modul 3 — Customer adalah pihak luar', link: '/jalur/03' },
        { label: 'Modul 4 — Proses audit pesanan', link: '/jalur/04' },
        { label: 'Modul 5 — Pembayaran punya batas waktu', link: '/jalur/05' },
        { label: 'Modul 6 — Dua pekerjaan jalan bersamaan', link: '/jalur/06' },
        { label: 'Modul 7 — Model mulai terlalu padat', link: '/jalur/07' },
        { label: 'Modul 8 — Pengiriman bisa gagal', link: '/jalur/08' },
        { label: 'Modul 9 — Pembatalan setelah pembayaran ditarik', link: '/jalur/09' },
        { label: 'Modul 10 — Capstone', link: '/jalur/10' },
        { label: 'Cabang S1 — Reservasi perjalanan', link: '/jalur/s1' },
        { label: 'Cabang S2 — Pengaduan pelanggan dan SLA', link: '/jalur/s2' },
      ]},
      { label: 'Notasi', items: [
        { label: 'Katalog notasi Tier A', link: '/notasi/' },
        { label: 'E01 — None Start/End Event', link: '/notasi/none-event' },
        { label: 'A01 — Task', link: '/notasi/task' },
        { label: 'A02 — None Task', link: '/notasi/none-task' },
        { label: 'F01 — Sequence Flow', link: '/notasi/sequence-flow' },
        { label: 'G01 — Exclusive Gateway (XOR)', link: '/notasi/exclusive-gateway' },
        { label: 'A03 — Manual Task', link: '/notasi/manual-task' },
        { label: 'A04 — User Task', link: '/notasi/user-task' },
        { label: 'A05 — Service Task', link: '/notasi/service-task' },
        { label: 'A07 — Business Rule Task', link: '/notasi/business-rule-task' },
        { label: 'P01 — Pool / Participant', link: '/notasi/pool-participant' },
        { label: 'C01 — Collaboration', link: '/notasi/collaboration' },
        { label: 'F02 — Message Flow', link: '/notasi/message-flow' },
        { label: 'E02 — Message Event', link: '/notasi/message-event' },
        { label: 'A08 — Send Task', link: '/notasi/send-task' },
        { label: 'A09 — Receive Task', link: '/notasi/receive-task' },
        { label: 'P02 — Lane', link: '/notasi/lane' },
        { label: 'D01 — Data Object', link: '/notasi/data-object' },
        { label: 'F04 — Data Association', link: '/notasi/data-association' },
        { label: 'F03 — Association', link: '/notasi/association' },
        { label: 'R01 — Text Annotation', link: '/notasi/text-annotation' },
        { label: 'E03 — Timer Event', link: '/notasi/timer-event' },
        { label: 'G04 — Event-Based Gateway', link: '/notasi/event-based-gateway' },
        { label: 'G02 — Parallel Gateway (AND)', link: '/notasi/parallel-gateway' },
        { label: 'G03 — Inclusive Gateway (OR)', link: '/notasi/inclusive-gateway' },
        { label: 'D04 — Data Store', link: '/notasi/data-store' },
        { label: 'A13 — Embedded Subprocess', link: '/notasi/embedded-subprocess' },
        { label: 'A16 — Call Activity', link: '/notasi/call-activity' },
        { label: 'A11 — Multi-instance Marker', link: '/notasi/multi-instance' },
        { label: 'E06 — Error Event', link: '/notasi/error-event' },
        { label: 'E11 — Terminate End Event', link: '/notasi/terminate-event' },
        { label: 'E08 — Compensation Event', link: '/notasi/compensation-event' },
        { label: 'A12 — Compensation Marker', link: '/notasi/compensation-marker' },
        { label: 'A14 — Event Subprocess', link: '/notasi/event-subprocess' },
        { label: 'E05 — Signal Event', link: '/notasi/signal-event' },
        { label: 'E07 — Escalation Event', link: '/notasi/escalation-event' },
      ]},
      { label: 'Katalog referensi', items: [
        { label: 'Indeks katalog', link: '/katalog/' },
        { label: 'Matriks event', link: '/katalog/matriks-event' },
      ]},
      { label: 'Alat', items: [
        { label: 'Menggambar — demo.bpmn.io', link: '/alat/menggambar' },
        { label: 'Periksa model', link: '/alat/periksa-model' },
      ]},
      { label: 'Referensi', items: [
        { label: 'Semantik token', link: '/referensi/token' },
        { label: 'Cara membaca diagram', link: '/referensi/membaca-diagram' },
        { label: 'Tiga tingkat validitas', link: '/referensi/validitas' },
        { label: 'Anti-pattern umum', link: '/referensi/anti-pattern' },
        { label: 'Checklist review', link: '/referensi/review' },
        { label: 'Konvensi penamaan', link: '/referensi/penamaan' },
      ]},
      { label: 'Lampiran', items: [
        { label: 'Glosarium', link: '/lampiran/glosarium' },
        { label: 'Sumber dan atribusi', link: '/lampiran/sumber' },
        { label: 'Tentang tutorial ini', link: '/tentang' },
      ]},
    ]
  })]
});
