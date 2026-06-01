import { baseURL } from "@/resources";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/reza-control", "/reza-control/"],
      },
    ],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
