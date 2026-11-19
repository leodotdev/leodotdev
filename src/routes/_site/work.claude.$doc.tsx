import { Link, createFileRoute, notFound } from "@tanstack/react-router"
import { GROUPS, findGroup } from "@/components/work/claude/docs"
import { ButtonsDoc } from "@/components/work/claude/pages/buttons"
import { CardsDoc } from "@/components/work/claude/pages/cards"
import { ColorDoc } from "@/components/work/claude/pages/color"
import {
  AccordionDoc,
  CarouselDoc,
  SelectDoc,
  TabsDoc,
} from "@/components/work/claude/pages/disclosure"
import { FormsDoc } from "@/components/work/claude/pages/forms"
import { FramesDoc } from "@/components/work/claude/pages/frames"
import { FeaturesDoc, HeroesDoc } from "@/components/work/claude/pages/heroes"
import { LayoutDoc } from "@/components/work/claude/pages/layout"
import { ArtifactsDoc } from "@/components/work/claude/pages/artifacts"
import { HeadersDoc } from "@/components/work/claude/pages/headers"
import { IconographyDoc } from "@/components/work/claude/pages/iconography"
import { MediaDoc } from "@/components/work/claude/pages/media"
import { NavigationDoc } from "@/components/work/claude/pages/navigation"
import { MenuDoc, TooltipDoc } from "@/components/work/claude/pages/overlays"
import { ProofDoc } from "@/components/work/claude/pages/proof"
import { TypographyDoc } from "@/components/work/claude/pages/typography"

// One tab of the design system docs: a group of topics, one after another
// (/work/claude/atoms, /molecules, /organisms, /templates). Unknown slugs
// are a 404.

const LIVE: Record<string, () => React.ReactNode> = {
  color: ColorDoc,
  typography: TypographyDoc,
  layout: LayoutDoc,
  iconography: IconographyDoc,
  buttons: ButtonsDoc,
  forms: FormsDoc,
  menu: MenuDoc,
  tooltip: TooltipDoc,
  tabs: TabsDoc,
  select: SelectDoc,
  accordion: AccordionDoc,
  carousel: CarouselDoc,
  navigation: NavigationDoc,
  headers: HeadersDoc,
  artifacts: ArtifactsDoc,
  heroes: HeroesDoc,
  features: FeaturesDoc,
  cards: CardsDoc,
  proof: ProofDoc,
  media: MediaDoc,
}

export const Route = createFileRoute("/_site/work/claude/$doc")({
  loader: ({ params }) => {
    const group = findGroup(params.doc)
    if (!group) throw notFound()
    return { title: group.name }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Docs"} · Claude.com Design System & Web Design`,
      },
    ],
  }),
  component: GroupPage,
})

function GroupPage() {
  const { doc: slug } = Route.useParams()
  const group = findGroup(slug)

  if (!group) return null
  const next = GROUPS.at(GROUPS.indexOf(group) + 1)

  // The chapters, one under another across the page. Their names are a row
  // under the tabs (ChapterNav, in the layout's bar, which stays at the top
  // of the window: a chapter's `scroll-mt` clears it).
  return (
    <div>
      <div className="min-w-0">
        {group.docs.map((doc) => {
          const Live = LIVE[doc.slug] as (() => React.ReactNode) | undefined
          return (
            <article
              key={doc.slug}
              id={doc.slug}
              data-chapter
              data-scaled={doc.kind === "live" || undefined}
              className="group/chapter rule-t scroll-mt-48 pt-12 first:pt-0 first:before:hidden md:scroll-mt-40"
            >
              {/* The chapter's name and, under it, the line the overview
                  gives it (the topic's summary, repeated where its row
                  leads), over its blocks. */}
              <div className="flex flex-col gap-1 pb-6">
                <h2 className="font-semibold">{doc.title}</h2>
                <p className="max-w-cols-9 text-xs text-pretty text-muted-foreground">
                  {doc.summary}
                </p>
              </div>
              {doc.kind === "frames" ? (
                <div className="pb-12">
                  <FramesDoc doc={doc} />
                </div>
              ) : (
                Live && <Live />
              )}
            </article>
          )
        })}

        {/* The system is a sequence, so each page ends by leading to the next. */}
        {next && (
          <div className="rule-t flex justify-end pt-6">
            <Link
              to="/work/claude/$doc"
              params={{ doc: next.slug }}
              className="group/item flex flex-col items-end gap-1"
            >
              <span className="text-xs text-muted-foreground">Next</span>
              <span className="underline decoration-dotted group-hover/item:text-tint group-hover/item:decoration-solid">
                {next.name}
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
