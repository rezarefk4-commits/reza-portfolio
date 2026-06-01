import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import { getPublishedProjects, getPublishedBlogs } from "@/lib/db";

export default async function sitemap() {
  // MDX blogs
  const mdxBlogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  // MDX works
  const mdxWorks = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  // CMS projects
  const cmsProjects = await getPublishedProjects().catch(() => []);
  const projectUrls = cmsProjects.map((p) => ({
    url: `${baseURL}/project/${p.slug}`,
    lastModified: p.updated_at || p.created_at,
  }));

  // CMS blogs
  const cmsBlogs = await getPublishedBlogs().catch(() => []);
  const blogUrls = cmsBlogs.map((b) => ({
    url: `${baseURL}/blog/${b.slug}`,
    lastModified: b.updated_at || b.created_at,
  }));

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  // Add contact route
  routes.push({ url: `${baseURL}/contact`, lastModified: new Date().toISOString().split("T")[0] });

  return [...routes, ...mdxBlogs, ...mdxWorks, ...projectUrls, ...blogUrls];
}
