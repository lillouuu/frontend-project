"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Root route ("/"). Doesn't render anything itself — just decides where to
// send the person based on whether they have a token, then redirects.
//
// NOTE: this only checks that a token EXISTS in localStorage, not that
// it's still valid (not expired, not revoked). A real app would verify it
// against the backend before trusting it. Fine for now since there's no
// "verify token" endpoint documented yet — upgrade this once there is one.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return null;
}