"use client";

import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "@/helpers/fetcher";

export default function Provider({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
}
