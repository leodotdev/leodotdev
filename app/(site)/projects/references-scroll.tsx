"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { playfairDisplay } from "@/lib/fonts";

interface Reference {
  name: string;
  title: string;
  company: string;
  linkedinUrl: string;
  initials: string;
  quote: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const references: Reference[] = [
  {
    name: "James Yu",
    title: "Senior Software Engineer",
    company: "Meta",
    linkedinUrl: "https://www.linkedin.com/in/smarts2013/", // Update this with actual LinkedIn URL
    initials: "JY",
    quote:
      "Leo volunteered to design for the Sticker Admin Tool for the Story Creation Team, which is one of our most important tools, to be used to deploy/manage sticker assets in sticker tray for public users. Historically, it has been a huge pain point as the old tool is lacking a lot of functionalities and very inefficient to use. Leo dedicated himself to this project with full passion and went full speed. After several iterations, the design was perfected and received very positive feedback from people across the whole Story Creation Team, which also made it to the 'Story of the Week.'",
    bgColor: "bg-yellow-50/40 dark:bg-yellow-950/20",
    textColor: "text-yellow-950 dark:text-yellow-50/80",
    borderColor: "border-yellow-500/20 dark:border-yellow-500/10",
  },
  {
    name: "Alexander Lambert",
    title: "Design Director",
    company: "BitGo",
    linkedinUrl: "https://www.linkedin.com/in/abldotdesign/", // Update this with actual LinkedIn URL
    initials: "AL",
    quote:
      "Leo is a deep thinker who lives in between design and code. While at BitGo, Leo took ownership of the design system by streamlining components, testing new UI elements within the product, and bridging those components with our UI repository. He's excited to live in these two worlds by supporting both the design and front-end engineering teams. Previously, he led some of BitGo's newest market growing spaces, including BitGo Prime and Go products, helping connect our users with partner services. Leo has a level head and pragmatic style required to design, build, launch, and maintain complex systems.",
    bgColor: "bg-lime-50/40 dark:bg-lime-950/20",
    textColor: "text-lime-950 dark:text-lime-50/80",
    borderColor: "border-lime-500/20 dark:border-lime-500/10",
  },
  {
    name: "Justin Harsch",
    title: "Design Director",
    company: "Benenson Strategy Group",
    linkedinUrl: "https://www.linkedin.com/in/justinharsch", // Update this with actual LinkedIn URL
    initials: "JH",
    quote:
      "Rarely do you meet a creative with such a lethal combination of technical skills and fundamental design ability. Leo can handle any project from classic graphic design to robust web projects using the latest technology with ease. It was a pleasure to work with someone who was never out of their element.",
    bgColor: "bg-green-50/40 dark:bg-green-950/20",
    textColor: "text-green-950 dark:text-green-50/80",
    borderColor: "border-green-500/20 dark:border-green-500/10",
  },
  {
    name: "Melissa Bazillion",
    title: "Marketing Strategist",
    company: "MassMutual",
    linkedinUrl: "https://www.linkedin.com/in/melissabazillion", // Update this with actual LinkedIn URL
    initials: "MB",
    quote:
      "I can't stress the relief I felt every time Leo and I worked together. He is one of the most reliable partners and brings an incredible amount of creativity and expertise to every project.",
    bgColor: "bg-emerald-50/40 dark:bg-emerald-950/20",
    textColor: "text-emerald-950 dark:text-emerald-50/80",
    borderColor: "border-emerald-500/20 dark:border-emerald-500/10",
  },
  {
    name: "Bryce Trueman",
    title: "Product Manager",
    company: "BitGo",
    linkedinUrl: "https://www.linkedin.com/in/brycetrueman/", // Update this with actual LinkedIn URL
    initials: "BT",
    quote:
      "[Leo is] killing it on the design front! Thank you so much for your hard work and always pushing for what's best for the customer! It's been super fun working together and I'm beyond excited to get [our project] out to the world!",
    bgColor: "bg-teal-50/40 dark:bg-teal-950/20",
    textColor: "text-teal-950 dark:text-teal-50/80",
    borderColor: "border-teal-500/20 dark:border-teal-500/10",
  },
];

export function ReferencesScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [cardVisibility, setCardVisibility] = useState<number[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate horizontal scroll based on page scroll
  useEffect(() => {
    if (containerRef.current) {
      const maxScroll =
        containerRef.current.scrollWidth - containerRef.current.clientWidth;
      const scrollPercentage = scrollY * 0.3; // Adjust this multiplier to control scroll speed
      const horizontalScroll = Math.min(scrollPercentage, maxScroll);
      containerRef.current.scrollLeft = horizontalScroll;

      // Trigger visibility update after programmatic scroll
      const updateEvent = new Event("scroll");
      containerRef.current.dispatchEvent(updateEvent);
    }
  }, [scrollY]);

  // Update card visibility on scroll
  useEffect(() => {
    const updateCardVisibility = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const cards = container.querySelectorAll(".reference-card");
      const visiblePercentages: number[] = [];

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardLeft = rect.left - containerRect.left;
        const cardRight = cardLeft + rect.width;

        // Calculate how much of the card is visible
        let visibilityPercentage = 0;

        if (cardRight > 0 && cardLeft < containerWidth) {
          const visibleLeft = Math.max(0, cardLeft);
          const visibleRight = Math.min(containerWidth, cardRight);
          const visibleWidth = visibleRight - visibleLeft;
          visibilityPercentage = visibleWidth / rect.width;
        }

        visiblePercentages[index] = visibilityPercentage;
      });

      setCardVisibility(visiblePercentages);
    };

    // Update on scroll events
    const handleScroll = () => {
      requestAnimationFrame(updateCardVisibility);
    };

    // Initial update
    updateCardVisibility();

    // Listen to both window scroll and container scroll
    window.addEventListener("scroll", handleScroll, { passive: true });
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Remove scrollY dependency to prevent re-creating listeners

  // Initial rotations for each card
  const initialRotations = [-3, 2, -4, 3, -2];

  return (
    <div id="references">
      <div className="px-6 pb-12 md:px-12">
        <div className="font-semibold">References</div>
        <div className=" text-muted-foreground">
          Folks I&#39;ve had the pleasure of working with.
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative -mb-12 -mt-8 flex w-full items-center gap-6 overflow-x-auto px-6 pb-12 pt-8 md:px-12"
        style={{ scrollBehavior: "auto" }}
      >
        {references.map((reference, index) => (
          <div
            key={reference.name}
            className={`reference-card flex h-fit max-w-lg shrink-0 flex-col gap-4 rounded-xl border p-6 transition-transform duration-700 ease-out ${reference.borderColor} ${reference.bgColor} ${reference.textColor}`}
            style={{
              transform: `rotate(${initialRotations[index] * (1 - (cardVisibility[index] || 0))}deg)`,
            }}
          >
            <div className={`${playfairDisplay.className} font-playfair`}>
              <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
                <p>&#34;{reference.quote}&#34;</p>
              </blockquote>
            </div>
            <div className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarFallback
                  className={`${reference.borderColor.replace("border-", "bg-").replace("/20", "/20")} ${reference.textColor.replace("text-", "text-").replace("dark:text-", "dark:text-")}`}
                >
                  {reference.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <a
                  href={reference.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dotted hover:decoration-solid transition-all"
                >
                  {reference.name}
                </a>
                <p className="text-sm opacity-60">
                  {reference.title}, {reference.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
