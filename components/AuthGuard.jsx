"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { tokenManager } from "../lib/auth";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if user is not logged in and not already on an auth route, redirect
    if (!tokenManager.getToken() && !pathname.startsWith("/auth")) {
      router.replace("/auth");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
