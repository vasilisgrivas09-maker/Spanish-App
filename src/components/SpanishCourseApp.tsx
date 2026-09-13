"use client";

import { useEffect, useRef } from "react";

import { mountSpanishCourse } from "@/lib/course/mount-app";

export function SpanishCourseApp() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    return mountSpanishCourse(root);
  }, []);

  return <main id="app" className="app" ref={rootRef} />;
}
