import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CityBackground } from "@/components/CityBackground";
import { CustomCursor } from "@/components/CustomCursor";
import { IntroLoader } from "@/components/IntroLoader";
import { Hero } from "@/components/Hero";
import { OriginStory } from "@/components/OriginStory";
import { SpiderSenseRadar } from "@/components/SpiderSenseRadar";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { SectionDivider, WebPullSection } from "@/components/SectionDivider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";

export const Route = createFileRoute("/")(({
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
} as any));

function Index() {
  const [booted, setBooted] = useState(false);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <CityBackground />
      <CustomCursor />
      <SmoothScroll />
      <ScrollProgress />

      {!booted && <IntroLoader onDone={() => setBooted(true)} />}

      {booted && (
        <>
          <Hero />

          <SectionDivider />
          <WebPullSection>
            <OriginStory />
          </WebPullSection>

          <SectionDivider />
          <WebPullSection>
            <SpiderSenseRadar />
          </WebPullSection>

          <SectionDivider />
          <WebPullSection>
            <Projects />
          </WebPullSection>

          <SectionDivider />
          <WebPullSection>
            <Contact />
          </WebPullSection>

          <Footer />
        </>
      )}
    </main>
  );
}
