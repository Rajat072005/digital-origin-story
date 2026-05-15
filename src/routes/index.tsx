import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CityBackground } from "@/components/CityBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { IntroLoader } from "@/components/IntroLoader";
import { Hero } from "@/components/Hero";
import { OriginStory } from "@/components/OriginStory";
import { NeuralInterface } from "@/components/NeuralInterface";
import { Projects } from "@/components/Projects";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";
import { SmoothScroll } from "@/components/SmoothScroll";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Rajat Trehan — Full Stack Developer" },
      {
        name: "description",
        content:
          "Cinematic interactive portfolio of Rajat Trehan — a full stack developer building immersive digital experiences.",
      },
      { property: "og:title", content: "Rajat Trehan — Full Stack Developer" },
      {
        property: "og:description",
        content: "Building immersive digital experiences.",
      },
    ],
  }),
});

function Index() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <CityBackground />
      <CustomCursor />
      <SmoothScroll />

      {!booted && <IntroLoader onDone={() => setBooted(true)} />}

      {booted && (
        <>
          <Hero />
          <SectionDivider />
          <OriginStory />
          <SectionDivider />
          <NeuralInterface />
          <SectionDivider />
          <Projects />
          <Footer />
        </>
      )}
    </main>
  );
}
