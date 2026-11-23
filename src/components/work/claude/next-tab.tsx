import { Link } from "@tanstack/react-router"
import type { LinkProps } from "@tanstack/react-router"

/**
 * The end of a tab's page: a link to the next tab, at the right under a
 * rule. A work project's tabs are a sequence, so each page leads to the
 * next, the overview included (Leo, 2026-11-23: "the bottom of overview
 * should offer next like other tabs"); the last tab has none.
 */
export function NextTab({ name, ...link }: LinkProps & { name: string }) {
  return (
    <div className="rule-t flex justify-end pt-6">
      <Link {...link} className="group/item flex flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground">Next</span>
        <span className="underline decoration-dotted group-hover/item:text-tint group-hover/item:decoration-solid">
          {name}
        </span>
      </Link>
    </div>
  )
}
