import { getPosts } from "@/utils/utils";
import { baseURL, blog, person } from "@/resources";
import { NextResponse } from "next/server";
import { getPublishedBlogs } from "@/lib/db";

export async function GET() {
  // MDX posts
  const mdxPosts = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    title: post.metadata.title,
    link: `${baseURL}/blog/${post.slug}`,
    guid: `${baseURL}/blog/${post.slug}`,
    pubDate: new Date(post.metadata.publishedAt).toUTCString(),
    description: post.metadata.summary || "",
    image: post.metadata.image ? `${baseURL}${post.metadata.image}` : "",
    category: post.metadata.tag || "",
  }));

  // CMS blogs
  const cmsBlogs = await getPublishedBlogs().catch(() => []);
  const cmsPosts = cmsBlogs.map((b) => ({
    title: b.title_id,
    link: `${baseURL}/blog/${b.slug}`,
    guid: `${baseURL}/blog/${b.slug}`,
    pubDate: new Date(b.created_at).toUTCString(),
    description: b.description_id || "",
    image: b.thumbnail || "",
    category: "",
  }));

  // Merge and sort by date
  const allPosts = [...mdxPosts, ...cmsPosts].sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
  );

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${blog.title}</title>
    <link>${baseURL}/blog</link>
    <description>${blog.description}</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseURL}/api/rss" rel="self" type="application/rss+xml" />
    <managingEditor>${person.email} (${person.name})</managingEditor>
    <webMaster>${person.email} (${person.name})</webMaster>
    <image>
      <url>${baseURL}${person.avatar}</url>
      <title>${blog.title}</title>
      <link>${baseURL}/blog</link>
    </image>
    ${allPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${post.link}</link>
      <guid>${post.guid}</guid>
      <pubDate>${post.pubDate}</pubDate>
      <description><![CDATA[${post.description}]]></description>
      ${post.image ? `<enclosure url="${post.image}" type="image/jpeg" />` : ""}
      ${post.category ? `<category>${post.category}</category>` : ""}
      <author>${person.email} (${person.name})</author>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
