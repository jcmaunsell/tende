"use client";

import { usePathname } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";
import { useLayoutEffect, useRef } from "react";

export default function VisualEditingLoader() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useLayoutEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Clear stale annotations synchronously before the new page's
    // data-sanity elements are painted, so the sidebar empties instantly.
    document.querySelectorAll<HTMLElement>("[data-sanity]").forEach((el) => {
      el.removeAttribute("data-sanity");
    });
  }, [pathname]);

  return <VisualEditing />;
}
