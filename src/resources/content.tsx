import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";

const person: Person = {
  firstName: "Reza",
  lastName: "Refka",
  name: "Reza Refka Kurniawan",
  role: "Full Stack Developer & Data Engineer",
  avatar: "/images/avatar.jpg",
  email: "rezarefka@gmail.com",
  location: "Asia/Makassar", // UTC+8
  languages: ["Indonesia", "English"],
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>Weekly insights on tech, data, and development.</>,
};

const social: Social = [
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/rezarefka",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/rezarefka",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/rezarefka",
    essential: false,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:rezarefka@gmail.com`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name} – Portfolio`,
  description: `Portfolio Reza Refka Kurniawan – Full Stack Developer & Data Engineer`,
  headline: <>Membangun solusi digital yang bermakna</>,
  featured: {
    display: false,
    title: <>Featured Work</>,
    href: "/work",
  },
  subline: (
    <>
      Saya Reza, seorang developer yang bersemangat membangun aplikasi web, mobile, dan visualisasi
      data. Berbasis di Makassar, Indonesia.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Kenali ${person.name}, ${person.role} dari Makassar, Indonesia`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Perkenalan",
    description: (
      <>
        Reza Refka Kurniawan adalah seorang Full Stack Developer dan Data Engineer yang berbasis di
        Makassar, Indonesia. Berfokus pada pengembangan solusi digital yang efisien dan bermakna,
        dari aplikasi web hingga visualisasi data yang informatif.
      </>
    ),
  },
  work: {
    display: true,
    title: "Pengalaman Kerja",
    experiences: [],
  },
  studies: {
    display: true,
    title: "Pendidikan",
    institutions: [],
  },
  technical: {
    display: true,
    title: "Keahlian Teknis",
    skills: [],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Tulisan tentang teknologi dan pengembangan",
  description: `Baca artikel terbaru dari ${person.name}`,
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Proyek – ${person.name}`,
  description: `Kumpulan proyek oleh ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Galeri Foto – ${person.name}`,
  description: `Koleksi foto oleh ${person.name}`,
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
