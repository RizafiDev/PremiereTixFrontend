// components/AuthInitializer.tsx
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function AuthInitializer() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return null;
}
