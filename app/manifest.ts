import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FluxoCerto",
    short_name: "Gastos",
    description: "Aplicativo para controle de gastos pessoais",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F172A",
    icons: [
        {
          src: "/favicon.png",
          sizes: "any",
          type: "image/svg+xml",
        },
        {
          src: "/favicon.ico",
          sizes: "48x48",
          type: "image/x-icon",
        },
      ],
  }
}
