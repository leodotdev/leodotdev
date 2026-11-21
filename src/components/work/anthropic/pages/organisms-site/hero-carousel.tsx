import { useState } from "react"
import { TbArrowLeft, TbArrowRight, TbDots } from "react-icons/tb"
import { Button } from "@/components/work/anthropic/specimens"

// The hero carousel (the file's "Hero Carousel", 3013:82003): one post at a
// time, its topic and date, title, summary and a "Read more" button in a
// dark panel beside its picture, with arrows and a count to step through
// the posts. From the laptop size down the picture goes on top and the
// text under it. The file draws it dark, so it wears the Slate theme.

type Slide = {
  topic: string
  date: string
  title: string
  summary: string
  /** The picture, exported from the file. */
  image: string
}

// The file's own posts: the carousel's, and the one its expanded navigation
// frames show. Their pictures are the two the carousel's media holds.
const SLIDES: Array<Slide> = [
  {
    topic: "Announcement",
    date: "Jan. 30, 2026",
    title: "Project Fetch: Can Claude train a robot dog?",
    summary:
      "We divided eight researchers into two teams—one with Claude, one without—and asked them to program robot dogs to fetch beach balls. Team Claude completed tasks in half the time and nearly achieved full autonomy, revealing how AI bridges digital and physical worlds.",
    image: "/work/anthropic/organisms-site/hero-fetch.webp",
  },
  {
    topic: "Announcement",
    date: "Jan. 30, 2026",
    title:
      "Project Vend: Can Claude run a small shop? (And why does that matter?)",
    summary:
      "Millions of people now use AI every day. As a company developing AI systems, we want to know how and why they’re doing so, and how it affects them.",
    image: "/work/anthropic/organisms-site/hero-vend.webp",
  },
]

const two = (n: number) => String(n).padStart(2, "0")

export function HeroCarousel({ theme = "slate" }: { theme?: string } = {}) {
  const [index, setIndex] = useState(0)
  const go = (by: number) =>
    setIndex((now) => (now + by + SLIDES.length) % SLIDES.length)
  return (
    <section
      className="ads ads-hero-carousel"
      data-theme={theme}
      aria-roledescription="carousel"
      aria-label="Featured posts"
    >
      <div className="ads-hero-carousel-media">
        {SLIDES.map((slide, i) => (
          <img
            key={slide.image}
            src={slide.image}
            alt=""
            data-current={i === index ? "" : undefined}
            loading="lazy"
          />
        ))}
      </div>
      <div className="ads-hero-carousel-panel">
        {/* Each post's text is laid in the same cell, so the panel keeps
            the height of the longest and nothing below it moves. */}
        <div className="ads-hero-carousel-slides">
          {SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              className="ads-hero-carousel-text"
              data-current={i === index ? "" : undefined}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <div className="ads-hero-carousel-meta ads-caption-1">
                <Button
                  variant="secondary"
                  size="tiny"
                  corner="round"
                  icon="only"
                  glyph={<TbDots aria-hidden />}
                  aria-label="More"
                  className="ads-hero-carousel-more"
                />
                <span>{slide.topic}</span>
                <span>{slide.date}</span>
              </div>
              <h2 className="ads-heading-5">{slide.title}</h2>
              <p className="ads-body-3">{slide.summary}</p>
              <Button
                variant="secondary"
                size="small"
                icon="trailing"
                className="ads-hero-carousel-read"
              >
                Read more
              </Button>
            </div>
          ))}
        </div>
        <div className="ads-hero-carousel-pages">
          <Button
            variant="tertiary"
            size="small"
            icon="only"
            glyph={<TbArrowLeft aria-hidden />}
            aria-label="Previous post"
            className="ads-hero-carousel-prev"
            onClick={() => go(-1)}
          />
          <span className="ads-caption-2-mono" aria-live="polite">
            {two(index + 1)} / {two(SLIDES.length)}
          </span>
          <Button
            variant="tertiary"
            size="small"
            icon="only"
            glyph={<TbArrowRight aria-hidden />}
            aria-label="Next post"
            className="ads-hero-carousel-next"
            onClick={() => go(1)}
          />
        </div>
      </div>
    </section>
  )
}
