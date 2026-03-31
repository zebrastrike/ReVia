import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ReVia Research Supply",
    short_name: "ReVia",
    description: "Premium research-grade peptides",
    start_url: "/",
    display: "standalone",
    background_color: "#F0EDE5",
    theme_color: "#A38569",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
    ],
  };
}
