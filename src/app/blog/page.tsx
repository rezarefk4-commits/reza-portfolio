import { Column, Heading, Meta, Schema, Text } from "@once-ui-system/core";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
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

      <Column fillWidth flex={1} gap="40">
        {/* Featured first post - large with thumbnail */}
        <Posts range={[1, 1]} thumbnail />

        {/* Next 4 posts - 2 col grid */}
        <Posts range={[2, 5]} columns="2" thumbnail direction="column" />

        {/* Remaining posts */}
        <Posts range={[6]} columns="2" />
      </Column>
    </Column>
  );
}
