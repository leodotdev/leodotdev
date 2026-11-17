import { createFileRoute, notFound } from "@tanstack/react-router"
import { findGroup } from "@/components/work/claude/docs"
import { ButtonsDoc } from "@/components/work/claude/pages/buttons"
import { CardsDoc } from "@/components/work/claude/pages/cards"
import { ColorDoc } from "@/components/work/claude/pages/color"
import { DisclosureDoc } from "@/components/work/claude/pages/disclosure"
import { FormsDoc } from "@/components/work/claude/pages/forms"
import { FramesDoc } from "@/components/work/claude/pages/frames"
import { HeroesDoc } from "@/components/work/claude/pages/heroes"
import { LayoutDoc } from "@/components/work/claude/pages/layout"
import { NavigationDoc } from "@/components/work/claude/pages/navigation"
import { OverlaysDoc } from "@/components/work/claude/pages/overlays"
import { ProofDoc } from "@/components/work/claude/pages/proof"
import { TypographyDoc } from "@/components/work/claude/pages/typography"

// One tab of the design system docs: a group of topics, one after another
// (/work/claude/foundations, /components, /patterns, /pages). Unknown slugs
// are a 404.

const LIVE: Record<string, () => React.ReactNode> = {
  color: ColorDoc,
  typography: TypographyDoc,
  layout: LayoutDoc,
  buttons: ButtonsDoc,
  forms: FormsDoc,
  overlays: OverlaysDoc,
  disclosure: DisclosureDoc,
  navigation: NavigationDoc,
  heroes: HeroesDoc,
  cards: CardsDoc,
  proof: ProofDoc,
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

  return (
    <>
      {/* Jump links to the topics on this page. The open tab names the group. */}
      <nav
        aria-label={`${group.name} topics`}
        className="flex flex-wrap gap-x-6 gap-y-1 pb-6 text-muted-foreground"
      >
        {group.docs.map((doc) => (
          <a
            key={doc.slug}
            href={`#${doc.slug}`}
            className="underline decoration-dotted underline-offset-4 hover:text-foreground hover:decoration-solid"
          >
            {doc.title}
          </a>
        ))}
      </nav>

      {group.docs.map((doc) => {
        const Live = LIVE[doc.slug] as (() => React.ReactNode) | undefined
        return (
          <article
            key={doc.slug}
            id={doc.slug}
            className="scroll-mt-6 border-t pt-12"
          >
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
    </>
  )
}
