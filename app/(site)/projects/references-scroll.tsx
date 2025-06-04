"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { playfairDisplay } from "@/lib/fonts";

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
        className="relative -mb-12 flex w-full items-center gap-6 overflow-x-auto px-6 pb-12 pt-8 -mt-8 md:px-12"
        style={{ scrollBehavior: "auto" }}
      >
        <div
          className="reference-card flex h-fit max-w-lg shrink-0 flex-col gap-4 rounded-xl border border-yellow-500/20 bg-yellow-50/40 p-6 text-yellow-950 transition-transform duration-700 ease-out dark:border-yellow-500/10 dark:bg-yellow-950/20 dark:text-yellow-50/80"
          style={{
            transform: `rotate(${initialRotations[0] * (1 - (cardVisibility[0] || 0))}deg)`,
          }}
        >
          <div className={`${playfairDisplay.className} font-playfair`}>
            <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
              <p>
                &#34;Leo volunteered to design for the Sticker Admin Tool for
                the Story Creation Team, which is one of our most important
                tools, to be used to deploy/manage sticker assets in sticker
                tray for public users.
              </p>
              <p>
                Historically, it has been a huge pain point as the old tool is
                lacking a lot of functionalities and very inefficient to use.
              </p>
              <p>
                Leo dedicated himself to this project with full passion and went
                full speed. After several iterations, the design was perfected
                and received very positive feedback from people across the whole
                Story Creation Team, which also made it to the &#39;Story of the
                Week.&#39;&#34;
              </p>
            </blockquote>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-yellow-500/20 text-yellow-900/80 dark:text-yellow-50/80">
                JY
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>James Yu</p>
              <p className="text-yellow-900/60 dark:text-yellow-50/40">
                Senior Software Engineer, Meta
              </p>
            </div>
          </div>
        </div>

        <div
          className="reference-card flex h-fit max-w-lg shrink-0 flex-col gap-4 rounded-xl border border-lime-500/20 bg-lime-50/40 p-6 text-lime-950 transition-transform duration-700 ease-out dark:border-lime-500/10 dark:bg-lime-950/20 dark:text-lime-50/80"
          style={{
            transform: `rotate(${initialRotations[1] * (1 - (cardVisibility[1] || 0))}deg)`,
          }}
        >
          <div className={`${playfairDisplay.className} font-playfair`}>
            <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
              <p>
                &#34;Leo is a deep thinker who lives in between design and code.
                While at BitGo, Leo took ownership of the design system by
                streamlining components, testing new UI elements within the
                product, and bridging those components with our UI repository.
                He&#39;s excited to live in these two worlds by supporting both
                the design and front-end engineering teams.
              </p>
              <p>
                Previously, he led some of BitGo&#39;s newest market growing
                spaces, including BitGo Prime and Go products, helping connect
                our users with partner services.
              </p>
              <p>
                Leo has a level head and pragmatic style required to design,
                build, launch, and maintain complex systems.&#34;
              </p>
            </blockquote>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-lime-500/20 text-lime-900/80 dark:text-lime-50/80">
                AL
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>Alexander Lambert</p>
              <p className="text-lime-900/60 dark:text-lime-50/40">
                Design Director, BitGo
              </p>
            </div>
          </div>
        </div>

        <div
          className="reference-card flex h-fit max-w-lg shrink-0 flex-col gap-4 rounded-xl border border-green-500/20 bg-green-50/40 p-6 text-green-950 transition-transform duration-700 ease-out dark:border-green-500/10 dark:bg-green-950/20 dark:text-green-50/80"
          style={{
            transform: `rotate(${initialRotations[2] * (1 - (cardVisibility[2] || 0))}deg)`,
          }}
        >
          <div className={`${playfairDisplay.className} font-playfair`}>
            <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
              &#34;Rarely do you meet a creative with such a lethal combination
              of technical skills and fundamental design ability. Leo can handle
              any project from classic graphic design to robust web projects
              using the latest technology with ease. It was a pleasure to work
              with someone who was never out of their element.&#34;
            </blockquote>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-green-500/20 text-green-900/80 dark:text-green-50/80">
                JH
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>Justin Harsch</p>
              <p className="text-green-900/60 dark:text-green-50/40">
                Design Director, Benenson Strategy Group
              </p>
            </div>
          </div>
        </div>

        <div
          className="reference-card flex h-fit max-w-lg shrink-0 flex-col gap-4 rounded-xl border border-emerald-500/20 bg-emerald-50/40 p-6 text-emerald-950 transition-transform duration-700 ease-out dark:border-emerald-500/10 dark:bg-emerald-950/20 dark:text-emerald-50/80"
          style={{
            transform: `rotate(${initialRotations[3] * (1 - (cardVisibility[3] || 0))}deg)`,
          }}
        >
          <div className={`${playfairDisplay.className} font-playfair`}>
            <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
              &#34;I can&#39;t stress the relief I felt every time Leo and I
              worked together. He is one of the most reliable partners and
              brings an incredible amount of creativity and expertise to every
              project.&#34;
            </blockquote>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-emerald-500/20 text-emerald-900/80 dark:text-emerald-50/80">
                MB
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>Melissa Bazillion</p>
              <p className="text-emerald-900/60 dark:text-emerald-50/40">
                Marketing Strategist, MassMutual
              </p>
            </div>
          </div>
        </div>

        <div
          className="reference-card flex h-fit max-w-lg shrink-0 flex-col gap-4 rounded-xl border border-teal-500/20 bg-teal-50/40 p-6 text-teal-950 transition-transform duration-700 ease-out dark:border-teal-500/10 dark:bg-teal-950/20 dark:text-teal-50/80"
          style={{
            transform: `rotate(${initialRotations[4] * (1 - (cardVisibility[4] || 0))}deg)`,
          }}
        >
          <div className={`${playfairDisplay.className} font-playfair`}>
            <blockquote className="flex flex-col gap-2 text-lg font-extralight leading-[1.5]">
              &#34;[Leo is] killing it on the design front! Thank you so much
              for your hard work and always pushing for what&#39;s best for the
              customer! It&#39;s been super fun working together and I&#39;m
              beyond excited to get [our project] out to the world!&#34;
            </blockquote>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-teal-500/20 text-teal-900/80 dark:text-teal-50/80">
                BT
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>Bryce Truman</p>
              <p className="text-teal-900/60 dark:text-teal-50/40">
                Product Manager, BitGo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
