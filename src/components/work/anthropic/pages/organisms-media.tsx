import { CodeDoc } from "./organisms-media/code"
import { MediaDoc } from "./organisms-media/media"
import { NarratorDoc } from "./organisms-media/narrator"
import { QuotesDoc } from "./organisms-media/quotes"

// The organisms media chapters of the Anthropic.com docs: each chapter's slug
// (as listed in ../docs.ts) and the component that draws it. The organisms
// themselves are exported for the page templates, which use them as they are.

export {
  Pagination,
  QuoteCard,
  QuoteCarousel,
  SAMPLE_QUOTE,
} from "./organisms-media/quotes"
export type { Quote } from "./organisms-media/quotes"
export {
  Media,
  MediaCarousel,
  PlayButton,
  VideoPlaylist,
} from "./organisms-media/media"
export type { Slide } from "./organisms-media/media"
export { ClaudeTerminal, CodeBlock } from "./organisms-media/code"
export { ClaudeNarrator } from "./organisms-media/narrator"
export { ArticleContext, FigCaption } from "./organisms-media/article"

export const ORGANISMS_MEDIA: Record<string, () => React.ReactNode> = {
  quotes: QuotesDoc,
  "media-carousel": MediaDoc,
  "code-block": CodeDoc,
  "claude-narrator": NarratorDoc,
}
