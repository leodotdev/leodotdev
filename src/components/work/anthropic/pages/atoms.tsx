import { ButtonsDoc } from "@/components/work/anthropic/pages/atoms/buttons"
import {
  InputsDoc,
  SelectionDoc,
  SliderDoc,
} from "@/components/work/anthropic/pages/atoms/fields"
import {
  CaptionsDoc,
  MediaDoc,
  PoweredDoc,
  RichTextDoc,
} from "@/components/work/anthropic/pages/atoms/marks"

// The atoms chapters of the Anthropic.com docs: each chapter's slug
// (as listed in ../docs.ts) and the component that draws it. The chapters
// themselves are in ./atoms/, the controls they show in ../specimens.tsx,
// and their styles in src/anthropic/atoms.css (the Button's in
// src/anthropic-ds.css).

export const ATOMS: Record<string, () => React.ReactNode> = {
  buttons: ButtonsDoc,
  selection: SelectionDoc,
  inputs: InputsDoc,
  slider: SliderDoc,
  captions: CaptionsDoc,
  "powered-by-claude": PoweredDoc,
  media: MediaDoc,
  "rich-text": RichTextDoc,
}
