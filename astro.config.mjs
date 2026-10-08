import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  output: 'static',
  base,
  redirects: {
    '/gateways/index': '/gateways/',
    '/events/index': '/events/',
    '/data/index': '/data/',
    '/advanced/index': '/advanced/',
  },
  integrations: [starlight({
    title: 'Tutorial BPMN by Pak Tik',
    description: 'Tutorial BPMN 2.0 berbahasa Indonesia untuk memahami semantik proses.',
    defaultLocale: 'root',
    locales: { root: { label: 'Bahasa Indonesia', lang: 'id' } },
    customCss: ['./src/styles/custom.css'],
    components: { Footer: './src/components/Footer.astro' },
    sidebar: [
      { label: 'Mulai', items: [{ label: 'Beranda', link: '/' }, { label: 'Peta belajar', link: '/jalur-belajar' }] },
      { label: '1. Fondasi', items: [{ label: 'Apa itu BPMN?', link: '/fondasi/apa-itu-bpmn' }, { label: 'Bagaimana token bergerak', link: '/fondasi/token' }] },
      { label: '2. Menyusun model', items: [{ label: 'Pool dan lane', link: '/participants/pool-lane' }, { label: 'Sequence flow dan koneksi', link: '/participants/flow' }, { label: 'Task dan jenisnya', link: '/activities/task' }, { label: 'Subprocess', link: '/activities/subprocess' }] },
      { label: '3. Mengendalikan alur', items: [{ label: 'Memilih gateway', link: '/gateways/' }, { label: 'Memilih event', link: '/events/' }, { label: 'Data dan artifacts', link: '/data/' }] },
      { label: '4. Mendalami notasi', items: [{ label: 'Pola lanjutan', link: '/advanced/' }, { label: 'Matriks event', link: '/events/matrix' }, { label: 'Katalog varian event', link: '/events/catalog' }] },
      { label: '5. Latihan', items: [{ label: 'Dari narasi ke BPMN', link: '/practice/narrative' }, { label: 'Review model', link: '/practice/review' }, { label: 'Capstone', link: '/practice/capstone' }] },
      { label: 'Referensi', items: [{ label: 'Tentang dan lisensi', link: '/about' }] }
    ]
  })]
});