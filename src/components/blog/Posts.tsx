import { getPublishedBlogs } from "@/lib/db";
import { getPosts } from "@/utils/utils";
import { Grid } from "@once-ui-system/core";
import Post from "./Post";
import CmsPost from "./CmsPost";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
  exclude?: string[];
}

export async function Posts({
  range,
  columns = "1",
  thumbnail = false,
  exclude = [],
  direction,
}: PostsProps) {
  // Try Supabase CMS
  const cmsBlogs = await getPublishedBlogs().catch(() => []);

  if (cmsBlogs.length > 0) {
    let blogs = cmsBlogs;

    if (exclude.length) {
      blogs = blogs.filter((b) => !exclude.includes(b.slug));
    }

    const displayed = range
      ? blogs.slice(range[0] - 1, range.length === 2 ? range[1] : blogs.length)
      : blogs;

    return (
      <>
        {displayed.length > 0 && (
          <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
            {displayed.map((post) => (
              <CmsPost key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
            ))}
          </Grid>
        )}
      </>
    );
  }

  // Fallback to MDX
  let allBlogs = getPosts(["src", "app", "blog", "posts"]);

  if (exclude.length) {
    allBlogs = allBlogs.filter((post) => !exclude.includes(post.slug));
  }

  const sortedBlogs = allBlogs.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });

  const displayedBlogs = range
    ? sortedBlogs.slice(range[0] - 1, range.length === 2 ? range[1] : sortedBlogs.length)
    : sortedBlogs;

  return (
    <>
      {displayedBlogs.length > 0 && (
        <Grid columns={columns} s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
          {displayedBlogs.map((post) => (
            <Post key={post.slug} post={post} thumbnail={thumbnail} direction={direction} />
          ))}
        </Grid>
      )}
    </>
  );
}
