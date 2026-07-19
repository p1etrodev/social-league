import type { Metadata } from "next";
import { siteDescription } from "@/lib/site";
import { AboutView } from "./AboutView";

export const metadata: Metadata = {
  title: "Acerca de",
  description: siteDescription,
};

export default function AboutPage() {
  return <AboutView />;
}
