// /work/amo's Design tab: the ten screens of the Figma file (amo-2023), a
// chapter to a pair as its boards pair them. The overview lists them under
// the research strip (research.tsx); a chapter's figure is in screens.tsx.

export type AmoDoc = { slug: string; title: string; summary: string }

export const DESIGN: Array<AmoDoc> = [
  {
    slug: "home",
    title: "Home & Lists",
    summary: "Contacts on the home screen, and its lists.",
  },
  {
    slug: "landing",
    title: "Landing",
    summary: "The contacts, as cards or as a list.",
  },
  {
    slug: "scroll",
    title: "Scroll",
    summary: "Both views, scrolled.",
  },
  {
    slug: "search",
    title: "Search",
    summary: "Focused, and with a name typed in.",
  },
  {
    slug: "contact",
    title: "Contact",
    summary: "One person: a sheet, and their pictures.",
  },
]
