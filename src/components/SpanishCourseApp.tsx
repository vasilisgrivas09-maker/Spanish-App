"use client";

import { useEffect, useRef } from "react";

import { AppSkeleton } from "@/components/AppSkeleton";

export function SpanishCourseApp() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    void import("@/lib/course/mount-app")
      .then(({ mountSpanishCourse }) => {
        if (cancelled || !rootRef.current) return;
        cleanup = mountSpanishCourse(rootRef.current);
      })
      .catch((error: unknown) => {
        console.error("Failed to mount Spanish course app", error);
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <main id="app" className="app" ref={rootRef}>
      <AppSkeleton />
    </main>
  );
}
