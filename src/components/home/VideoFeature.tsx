"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ExternalLink, Play } from "lucide-react";

interface VideoFeatureProps {
  videoId: string;
  title: string;
}

export function VideoFeature({ videoId, title }: VideoFeatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // `active` = whether the autoplay/muted/loop iframe is currently mounted.
  // Set true by either IntersectionObserver (in viewport) or the manual play button.
  const [active, setActive] = useState(false);
  // Whether the user explicitly clicked play (so we keep it mounted even if it
  // briefly scrolls out, giving the click-to-play fallback a stable experience).
  const [manualPlay, setManualPlay] = useState(false);

  const watchUrl = useMemo(
    () => `https://www.youtube.com/watch?v=${videoId}`,
    [videoId],
  );

  const posterUrl = useMemo(
    () => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    [videoId],
  );

  // autoplay must be muted per browser policy; loop needs playlist=<id> to
  // actually repeat a single video.
  const embedUrl = useMemo(
    () =>
      `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&rel=0&modestbranding=1`,
    [videoId],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    // Respect reduced-motion users: do not auto-play for them.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActive(true);
          } else if (!entry.isIntersecting && !manualPlay) {
            // Out of view and not manually started: tear down the iframe to
            // pause playback and free resources.
            setActive(false);
          }
        }
      },
      { threshold: [0, 0.6, 1] },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [manualPlay]);

  const handleManualPlay = () => {
    setManualPlay(true);
    setActive(true);
  };

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="group relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingBottom: "56.25%" }}
      >
        {/* Poster + play button fallback while the autoplay iframe is inactive */}
        {!active && (
          <button
            type="button"
            onClick={handleManualPlay}
            aria-label={`Play ${title}`}
            className="absolute inset-0 h-full w-full"
          >
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[hsl(var(--nav-theme))] shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 translate-x-0.5 text-white" fill="currentColor" />
            </span>
          </button>
        )}

        {/* Autoplaying / playing iframe */}
        {active && (
          <iframe
            className="absolute top-0 left-0 h-full w-full"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>

      <div className="flex justify-center">
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
        >
          Watch on YouTube
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
