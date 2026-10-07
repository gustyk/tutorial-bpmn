import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  output: 'static',
  base,
  integrations: [starlight({
    title: 'BPMN dari Makna',
    description: 'Tutorial BPMN 2.0 berbahasa Indonesia untuk memahami semantik proses.',
    defaultLocale: 'root',
    locales: { root: { label: 'Bahasa Indonesia', lang: 'id' } },
    customCss: ['./src/styles/custom.css'],
    components: { Footer: './src/components/Footer.astro' },
    sidebar: [
      { label: 'Mulai di sini', items: [{ label: 'Beranda', link: '/' }, { label: 'Jalur belajar', link: '/jalur-belajar' }] },
      { label: 'I. Fondasi', items: [{ label: 'Apa itu BPMN?', link: '/fondasi/apa-itu-bpmn' }, { label: 'Token dan alur', link: '/fondasi/token' }] },
      { label: 'II. Participants dan Flow', items: [{ label: 'Pool dan Lane', link: '/participants/pool-lane' }, { label: 'Flow dan Association', link: '/participants/flow' }] },
      { label: 'III. Activities', items: [{ label: 'Task', link: '/activities/task' }, { label: 'Subprocess', link: '/activities/subprocess' }] },
      { label: 'IV. Gateways', items: [{ label: 'Memilih Gateway', link: '/gateways/index' }] },
      { label: 'V. Events', items: [{ label: 'Memilih Event', link: '/events/index' }, { label: 'Event Matrix', link: '/events/matrix' }, { label: 'Katalog Varian Event', link: '/events/catalog' }] },
      { label: 'VI. Data dan Artifacts', items: [{ label: 'Data dan Artifacts', link: '/data/index' }] },
      { label: 'VII. Pola Lanjutan', items: [{ label: 'Pola Lanjutan', link: '/advanced/index' }] },
      { label: 'VIII–XI. Praktik dan Review', items: [{ label: 'Dari Narasi ke BPMN', link: '/practice/narrative' }, { label: 'Anti-pattern dan Review', link: '/practice/review' }, { label: 'Capstone', link: '/practice/capstone' }] },
      { label: 'Lampiran', items: [{ label: 'Inventaris & Coverage', link: '/appendix/coverage' }, { label: 'Sumber', link: '/appendix/sources' }, { label: 'Tentang & Lisensi', link: '/about' }] }
    ]
  })]
});