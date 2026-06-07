// Skeleton loading components untuk ProjectCard, BlogCard, GalleryItem

// ─── Shared pulse animation ───────────────────────────────────────────────────
const SKELETON_STYLE = `
  @keyframes skeletonPulse {
    0%   { opacity: 0.5; }
    50%  { opacity: 1; }
    100% { opacity: 0.5; }
  }
  .sk-pulse {
    background: var(--neutral-alpha-weak);
    border-radius: 6px;
    animation: skeletonPulse 1.6s ease-in-out infinite;
  }
  .sk-pulse-slow {
    background: var(--neutral-alpha-weak);
    border-radius: 6px;
    animation: skeletonPulse 2s ease-in-out infinite;
  }
`;

// ─── ProjectCard Skeleton ─────────────────────────────────────────────────────
export function ProjectCardSkeleton() {
  return (
    <>
      <style>{SKELETON_STYLE}</style>
      <div
        style={{
          borderRadius: 16,
          border: "1px solid var(--neutral-alpha-weak)",
          background: "var(--neutral-background-medium)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Thumbnail placeholder */}
        <div
          className="sk-pulse"
          style={{
            width: "100%",
            aspectRatio: "16/9",
            borderRadius: "14px 14px 0 0",
          }}
        />
        {/* Body */}
        <div
          style={{
            padding: "18px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Title */}
          <div className="sk-pulse" style={{ height: 22, width: "70%", borderRadius: 6 }} />
          {/* Description lines */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="sk-pulse-slow" style={{ height: 13, width: "100%", borderRadius: 4 }} />
            <div className="sk-pulse-slow" style={{ height: 13, width: "75%", borderRadius: 4 }} />
          </div>
          {/* Tool chips */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
            {[60, 72, 54, 68].map((w, i) => (
              <div
                key={i}
                className="sk-pulse"
                style={{ height: 22, width: w, borderRadius: 99 }}
              />
            ))}
          </div>
          {/* CTA button */}
          <div
            className="sk-pulse"
            style={{ height: 32, width: 110, borderRadius: 8, marginTop: 8 }}
          />
        </div>
      </div>
    </>
  );
}

// ─── BlogCard Skeleton ────────────────────────────────────────────────────────
export function BlogCardSkeleton({ withThumbnail = true }: { withThumbnail?: boolean }) {
  return (
    <>
      <style>{SKELETON_STYLE}</style>
      <div
        style={{
          borderRadius: 12,
          border: "1px solid var(--neutral-alpha-weak)",
          background: "transparent",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 0,
        }}
      >
        {withThumbnail && (
          <div
            className="sk-pulse"
            style={{ width: "100%", aspectRatio: "16/9", borderRadius: "12px 12px 0 0" }}
          />
        )}
        <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Meta row */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div className="sk-pulse" style={{ width: 24, height: 24, borderRadius: "50%" }} />
            <div className="sk-pulse-slow" style={{ width: 80, height: 12, borderRadius: 4 }} />
            <div className="sk-pulse-slow" style={{ width: 60, height: 12, borderRadius: 4 }} />
          </div>
          {/* Title */}
          <div className="sk-pulse" style={{ height: 20, width: "85%", borderRadius: 6 }} />
          <div className="sk-pulse" style={{ height: 20, width: "55%", borderRadius: 6 }} />
          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div className="sk-pulse-slow" style={{ height: 12, width: "100%", borderRadius: 4 }} />
            <div className="sk-pulse-slow" style={{ height: 12, width: "65%", borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── GalleryItem Skeleton ─────────────────────────────────────────────────────
export function GalleryItemSkeleton({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return (
    <>
      <style>{SKELETON_STYLE}</style>
      <div
        className="sk-pulse"
        style={{
          width: "100%",
          aspectRatio: orientation === "vertical" ? "3/4" : "16/9",
          borderRadius: 14,
          marginBottom: 12,
          breakInside: "avoid",
        }}
      />
    </>
  );
}

// ─── ProjectCardSkeletonGrid (3 cards) ───────────────────────────────────────
export function ProjectCardSkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%", paddingInline: "var(--static-space-24)" }}>
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── BlogCardSkeletonGrid ─────────────────────────────────────────────────────
export function BlogCardSkeletonGrid({ count = 4, withThumbnail = true }: { count?: number; withThumbnail?: boolean }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: 16,
      width: "100%",
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} withThumbnail={withThumbnail} />
      ))}
    </div>
  );
}

// ─── GallerySkeletonGrid ──────────────────────────────────────────────────────
export function GallerySkeletonGrid({ count = 8 }: { count?: number }) {
  const orientations: ("horizontal" | "vertical")[] = [
    "horizontal","vertical","horizontal","horizontal","vertical","horizontal","vertical","horizontal",
  ];
  return (
    <div style={{ columns: "2 280px", gap: 12, width: "100%" }}>
      {Array.from({ length: count }).map((_, i) => (
        <GalleryItemSkeleton key={i} orientation={orientations[i % orientations.length]} />
      ))}
    </div>
  );
}
