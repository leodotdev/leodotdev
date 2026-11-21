import { ColorDoc } from "@/components/work/anthropic/pages/foundations/color"
import { EffectsDoc } from "@/components/work/anthropic/pages/foundations/effects"
import { GridsDoc } from "@/components/work/anthropic/pages/foundations/grids"
import { TypographyDoc } from "@/components/work/anthropic/pages/foundations/typography"

// The foundations chapters of the Anthropic.com docs: each chapter's slug
// (as listed in ../docs.ts) and the component that draws it.

export const FOUNDATIONS: Record<string, () => React.ReactNode> = {
  typography: TypographyDoc,
  grids: GridsDoc,
  color: ColorDoc,
  effects: EffectsDoc,
}
