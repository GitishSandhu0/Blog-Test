"use client";

import { ReactNode } from "react";

export default function Highlight({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
      {children}
    </div>
  );
}
