import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion } from "./client";

// Cookie-credentialed client: mutations succeed only in a browser logged in
// to sanity.io as a member of this project. No token — safe to ship.
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  withCredentials: true,
});
