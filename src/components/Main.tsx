"use client";

import { SWRConfig } from "swr";
import { Footer } from "./Footer";
import { Game } from "./Game";
import { Header } from "./Header";
import { fetcher } from "@/lib/fetcher";

export const Main = () => {
  return (
    <SWRConfig value={{ fetcher }}>
      <main className="flex min-h-screen flex-col items-center justify-between p-8">
        <SWRConfig value={{ refreshInterval: 2000 }}>
          <Header />
        </SWRConfig>
        <Game />
        <Footer />
      </main>
    </SWRConfig>
  );
};
