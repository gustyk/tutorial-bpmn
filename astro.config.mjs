import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

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
        { label: 'Modul 1 — Pesanan toko daring', link: '/jalur/01' },
        { label: 'Modul 2 — Pembayaran dan pengiriman', link: '/jalur/02' },
        { label: 'Modul 3 — Penanganan retur', link: '/jalur/03' },
        { label: 'Modul 4 — Pemesanan multi-pemasok', link: '/jalur/04' },
        { label: 'Modul 5 — Proses persetujuan', link: '/jalur/05' },
        { label: 'Modul 6 — Koordinasi paralel', link: '/jalur/06' },
        { label: 'Modul 7 — Proses berlapis', link: '/jalur/07' },
        { label: 'Modul 8 — Pengiriman internasional', link: '/jalur/08' },
        { label: 'Modul 9 — Layanan langganan', link: '/jalur/09' },
        { label: 'Modul 10 — Capstone', link: '/jalur/10' },
        { label: 'Cabang S1 — Reservasi perjalanan', link: '/jalur/s1' },
        { label: 'Cabang S2 — Pemrosesan klaim', link: '/jalur/s2' },
      ]},
      { label: 'Notasi', items: [
        { label: 'Katalog notasi Tier A', link: '/notasi/' },
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
