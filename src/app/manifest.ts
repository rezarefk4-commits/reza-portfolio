import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Reza Refka Kurniawan – Portfolio",
    short_name: "Reza Refka",
    description: "Portfolio Reza Refka Kurniawan – Full Stack Developer & Data Engineer",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/avatar.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/avatar.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
