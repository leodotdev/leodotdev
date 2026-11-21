import { AccordionDoc } from "./organisms-content/accordion"
import { CardsDoc } from "./organisms-content/cards"
import { FlyOutDoc } from "./organisms-content/flyout"
import { ListsDoc } from "./organisms-content/lists"
import { TableDoc } from "./organisms-content/table"
import { LatestUpdatesDoc } from "./organisms-content/updates"

// The organisms content chapters of the Anthropic.com docs: each chapter's slug
// (as listed in ../docs.ts) and the component that draws it. The organisms
// themselves are exported from their files under ./organisms-content, for
// the page templates to reuse.

export { Accordion, AccordionCard } from "./organisms-content/accordion"
export {
  AssetItem,
  CaseStudyCard,
  TableGridItem,
  ToutCard,
} from "./organisms-content/cards"
export { FlyOut } from "./organisms-content/flyout"
export {
  Constellation,
  ListItem,
  NewsItem,
  NewsThumb,
  RelatedList,
} from "./organisms-content/lists"
export { MenuTopicDate, TinyMore } from "./organisms-content/shared"
export {
  RelatedCard,
  Table,
  TableCard,
  TableRow,
  relatedCount,
} from "./organisms-content/table"
export { GraphIcon, PostGraph } from "./organisms-content/graph"
export { Panning } from "./organisms-content/panning"
export { LatestUpdates, UpdatesItem } from "./organisms-content/updates"

export const ORGANISMS_CONTENT: Record<string, () => React.ReactNode> = {
  lists: ListsDoc,
  cards: CardsDoc,
  "latest-updates": LatestUpdatesDoc,
  table: TableDoc,
  accordion: AccordionDoc,
  "fly-out": FlyOutDoc,
}
