"use client";

import { usePathname } from "next/navigation";
import { VisualEditing } from "next-sanity/visual-editing";

export default function VisualEditingLoader() {
  const pathname = usePathname();
  return <VisualEditing key={pathname} />;
}
