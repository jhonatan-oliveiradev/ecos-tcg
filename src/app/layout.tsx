import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "../styles/global.css";

export const metadata: Metadata = {
  title: "Ecos — Fábula Neon",
  description:
    "Crie vínculos. Desperte um novo mundo. Um jogo de cartas em uma metrópole retomada pela natureza.",
};

export const viewport: Viewport = { themeColor: "#0a181b" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
