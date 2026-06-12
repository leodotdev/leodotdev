"use client";

import { useEffect, useState } from "react";
import { writeClient } from "@/sanity/write-client";

export function useSanityAdmin(): boolean {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;

    writeClient
      .request<{ id?: string }>({ uri: "/users/me", withCredentials: true })
      .then((user) => {
        if (!cancelled && typeof user?.id === "string" && user.id.length > 0) {
          setIsAdmin(true);
        }
      })
      .catch(() => {
        // Not logged in, CORS unconfigured, or offline — stay read-only.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return isAdmin;
}
