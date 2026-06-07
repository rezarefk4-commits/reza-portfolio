import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { baseURL, blog, person } from "@/resources";
import { getPublishedBlogs } from "@/lib/db";
import { BlogListClient } from "@/components/blog/BlogListClient";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default async function Blog() {
  const blogs = await getPublishedBlogs().catch(() => []);

  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="8" variant="heading-strong-xl" marginLeft="24">
        {blog.title}
      </Heading>
      <Text
        variant="body-default-m"
        onBackground="neutral-weak"
        marginLeft="24"
        marginBottom="l"
      >
        {blog.description}
      </Text>

      <Column fillWidth flex={1} gap="0">
        <BlogListClient initialBlogs={blogs} />
      </Column>
    </Column>
  );
}
