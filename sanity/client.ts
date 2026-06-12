import { createClient } from "next-sanity";

export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "jyqe7nab";
export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2023-10-07";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
