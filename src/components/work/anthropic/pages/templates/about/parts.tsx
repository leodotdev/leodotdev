import { useState } from "react"
import { Pagination } from "@/components/work/anthropic/pages/molecules/controls"
import { Button, quiet } from "@/components/work/anthropic/specimens"
import { PageSection } from "@/components/work/anthropic/template"
import type { Sizes } from "@/components/work/claude/resizable"

// The pieces the About and Careers templates share: the two pages are
// drawn from the same parts in the file ("Section: Hero", "Hero Carousel"),
// so they are built once here. Styles: `.ads-company-*` in
// src/anthropic/templates/about.css.

/**
 * The layouts the pages' figures name: the header's own (its pills go
 * below Tablet, its wordmark below Mobile), at whose widths the pages
 * fold too.
 */
export const COMPANY_SIZES: Sizes = [
  ["Desktop"],
  ["Tablet", 1019],
  ["Mobile", 599],
]

/**
 * The top of the page:a large headline on the left, and on the right a
 * paragraph in the serif over a primary button. On a phone the two stack.
 */
export function Mission({
  title,
  text,
  action,
  align = "end",
}: {
  title: string
  text: string
  action: string
  /** Where the right column sits against the headline: its foot or top. */
  align?: "start" | "end"
}) {
  return (
    <div className="ads-company-mission" data-align={align}>
      <h1 className="ads-display-1">{title}</h1>
      <div className="ads-company-mission-side">
        <p className="ads-body-1-serif">{text}</p>
        <div>
          <Button icon="trailing">{action}</Button>
        </div>
      </div>
    </div>
  )
}

/**
 * One of the page's ruled rows: a heading and its text in the first three
 * columns, what it introduces in the last seven. Narrower, the heading
 * goes over it.
 */
export function Row({
  title,
  children,
  aside,
}: {
  title: string
  /** Under the heading: its paragraph, perhaps a button. */
  aside?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="ads-company-row">
      <div className="ads-company-row-head">
        <h2 className="ads-heading-4">{title}</h2>
        {aside}
      </div>
      <div className="ads-company-row-body">{children}</div>
    </div>
  )
}

export type Slide = {
  image: string
  title: string
  text: string
}

/**
 * The file's "Hero Carousel" as these pages use it: a band in the second
 * background, its heading and text on the left, and the slide, a square
 * picture with its title, text, and pagination beside it at its foot. The
 * file draws the first slide only, and counts the rest ("01 / 03"), so
 * each step of the pagination shows that slide again, coming in as a new
 * one would.
 */
export function Band({
  title,
  slide,
  total,
  children,
}: {
  title: string
  slide: Slide
  total: number
  /** The text under the heading. */
  children: React.ReactNode
}) {
  const [page, setPage] = useState(1)
  return (
    <PageSection
      theme={["ivory-medium", "slate"]}
      tone={2}
      className="ads-company-band"
    >
      <div className="ads-company-band-head">
        <h2 className="ads-heading-5">{title}</h2>
        {children}
      </div>
      <div className="ads-company-slide">
        <img
          key={`image-${page}`}
          src={slide.image}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <div className="ads-company-slide-text">
          <div key={`text-${page}`}>
            <h3 className="ads-heading-5">{slide.title}</h3>
            <p className="ads-body-3">{slide.text}</p>
          </div>
          <Pagination
            total={total}
            page={page}
            onChange={setPage}
            label="Slides"
          />
        </div>
      </div>
    </PageSection>
  )
}

/** A link in running text, underlined, as the file draws them. */
export function InlineLink({ children }: { children: React.ReactNode }) {
  return (
    <a href="#trust" className="ads-company-link" {...quiet}>
      {children}
    </a>
  )
}
