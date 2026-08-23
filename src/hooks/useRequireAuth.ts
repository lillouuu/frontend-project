import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Kicks unauthenticated visitors back to /login from any page that uses it.
// Put this ONE call in (app)/layout.tsx and every page under that layout
// (Dashboard, Audit, Optimization, Content, Calendar, Benchmark, Assistant,
// Reports, Settings) is protected automatically — no need to repeat this
// in each page.
//
// Same honest limitation as the root page redirect: this only checks that
// a token EXISTS, not that it's still valid. Upgrade once there's a
// "verify token" endpoint to actually check against.
export function useRequireAuth() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  // Pages can use this to avoid a flash of content before the redirect
  // kicks in, e.g.: if (!checked) return null;
  return { checked };
}