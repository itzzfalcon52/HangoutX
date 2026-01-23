"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRequireAuth(nextPath) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
        const next = nextPath ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
        router.replace(`/login?next=${encodeURIComponent(next)}`);

    }
  }, [nextPath]);
}
