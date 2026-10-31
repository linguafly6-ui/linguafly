import type { Metadata } from "next";
import { Navigation } from "@/components/sections/Navigation";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Academia de inglés A2–C1 | Linguafly",
  description: "Itinerarios de inglés por nivel con unidades y práctica interactiva.",
};

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  );
}
