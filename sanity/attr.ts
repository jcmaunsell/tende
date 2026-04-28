import { createDataAttribute } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export function da(id: string, type: string) {
  return createDataAttribute({ projectId, dataset, id, type });
}
