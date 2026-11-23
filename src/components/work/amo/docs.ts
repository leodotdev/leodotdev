// /work/amo's tabs and their chapters: the research on the project's FigJam
// board, then the ten screens of its Figma file (amo-2023). A chapter's
// figures are in research.tsx and screens.tsx.

export type AmoDoc = { slug: string; title: string; summary: string }
export type AmoTab = { slug: "" | "design"; name: string; docs: Array<AmoDoc> }

export const TABS: Array<AmoTab> = [
  {
    slug: "",
    name: "Research",
    docs: [
      {
        slug: "notes",
        title: "Notes",
        summary:
          "What using the Contacts app as it is today left me wishing for.",
      },
      {
        slug: "today-next",
        title: "Today & Next",
        summary:
          "Where contacts live today, in every app that talks, and where they could: one Contacts that the others come to.",
      },
      {
        slug: "degrees",
        title: "Degrees",
        summary:
          "People by how close they are: rings going out from the phone, then a first wireframe of them.",
      },
      {
        slug: "sketch",
        title: "Sketch",
        summary: "The list, first drawn: its filter, its views, and its cards.",
      },
      {
        slug: "inspiration",
        title: "Inspiration",
        summary: "What other people have wished the Contacts app did.",
      },
      {
        slug: "principle",
        title: "Principle",
        summary: "The one rule for the design.",
      },
    ],
  },
  {
    slug: "design",
    name: "Design",
    docs: [
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
    ],
  },
]
