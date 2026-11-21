import type { StripItem } from "@/components/work/claude/media"

// The film strip at the top of the Anthropic overview: the studio's own clips
// of the work (streamed from Mux) and three stills (from its image host), in
// the order of its case study (Leo, 2026-11-19). Each one's label is the
// case study's own description of it.

const sanity = (file: string) =>
  `https://cdn.sanity.io/images/5jjj3zhb/production/${file}`

export const ANTHROPIC_MEDIA: Array<StripItem> = [
  {
    src: sanity("bb07eee94bf7691cbca0f7c71061696a703d569f-11076x7844.png"),
    ratio: 11076 / 7844,
    label:
      "Library imagery that grounded the visual approach for anthropic.com.",
  },
  {
    id: "QfB2hXJHAmNMR01hexzprWT3LiGBlI4BPGUNY3tfeE2Y",
    ratio: 3 / 2,
    label:
      "Anthropic.com layouts inspired by textbooks and research papers, with found and scanned imagery.",
  },
  {
    id: "g003Cg00wQFsV02PNa87b00mjLrMibiyTSg3jrxgCwyonnQ",
    ratio: 1,
    label:
      "A node network of thousands of pieces of Anthropic content, with lines tracing the connections between them.",
  },
  {
    src: sanity("e5f74a3a51e85ae261dc3626172c7bdedcc092c9-4000x6000.png"),
    ratio: 4000 / 6000,
    label:
      "Search results laid out as a visual overview of everything Anthropic has published.",
  },
  {
    id: "AwQIjKY4BrJBoW40100oteAib00300G2cIvpk6Ew9Ckz6Ag",
    ratio: 1,
    label:
      "Content nodes explode into constellations, viewed one after another like specimens, each mapping a single piece of content's connections.",
  },
  {
    id: "aWbQkQ9FnFk2xYIF9hlfBsNRTiABi1hAGZ1wbfdD94Y",
    ratio: 16 / 9,
    label: "Screen recording of the redesigned anthropic.com design system.",
  },
  {
    id: "CDhyu4WBxTVsGXgF4aTgJUBTJnrwtI4paJE202IHdJo8",
    ratio: 1,
    label:
      "The anthropic.com design system, with type scale, grid and spacing derived from the sigmoid function.",
  },
  {
    id: "ParoPgvqABihak2P016e2MlFYcjjMANpXhhtikiw46oo",
    ratio: 3 / 2,
    label: "Interactive timeline and bookshelf components on anthropic.com.",
  },
  {
    id: "4017cjrxuIFEGoNxe6JCyY37U9rFldsODatVd01LfpnQs",
    ratio: 16 / 9,
    label: "Design sketches and iterations from weekly sprints with Anthropic.",
  },
  {
    id: "4006cIWqhybMbYmfrdAFs02ar4HoRyfUiw87llPNIJUbk",
    ratio: 3 / 2,
    label:
      "Four desktop monitors in a library computer lab, each showing a different anthropic.com page: an article, search, a home page and a research team page.",
  },
  {
    src: sanity("ec0ab548f55cc1a8b9194f49ba7681e525436c24-3995x5992.png"),
    ratio: 3995 / 5992,
    label: "Anthropic's legal center page.",
  },
]
