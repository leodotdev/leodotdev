import { Section, Specimen, ThemeStrip } from "@/components/work/claude/ui"

// One illustration and one pictogram from the system's sets, exported from
// the Figma file as SVGs.
const ILLUSTRATION = "/work/claude/illustrations/hand-abacus.svg"
const PICTOGRAM = "/work/claude/illustrations/hand-link.svg"

function Sizes({ src, widths }: { src: string; widths: Array<number> }) {
  return (
    <Specimen
      figure
      className="flex flex-wrap items-end justify-center gap-x-16 gap-y-8 p-8 md:p-12"
    >
      {widths.map((width) => (
        <img key={width} className="cds-art" src={src} alt="" width={width} />
      ))}
    </Specimen>
  )
}

export function IconographyDoc() {
  return (
    <>
      <Section
        title="Illustration"
        caption="Each hero illustration is kept at three sizes: Large, Medium, and Small."
      >
        <Sizes src={ILLUSTRATION} widths={[280, 140, 72]} />
      </Section>

      <Section
        title="Pictogram"
        caption="Pictograms at their three sizes: Default, Medium, and Small."
      >
        <Sizes src={PICTOGRAM} widths={[96, 64, 48]} />
      </Section>

      <Section
        title="Across Themes"
        caption="Pictograms, checked against every color theme."
      >
        <ThemeStrip figure>
          <img className="cds-art my-4" src={PICTOGRAM} alt="" width={64} />
        </ThemeStrip>
      </Section>
    </>
  )
}
