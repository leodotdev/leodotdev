import { createContext, useEffect } from "react"

// The site's reveals, for the template pages: as a page is scrolled, what
// comes into view rises a little and fades in, a part at a time. They are
// claude.com's own, read from the site on 2026-11-19 (Leo: "make sure reveal
// animations in templates match those on claude.com"):
//
// - A hero's parts (pictogram, headline, lead, buttons) rise 16px, 0.12s
//   apart.
// - A section header's headline fades in a word at a time, the words spread
//   over 0.2s, each taking a second; what is under it (lead, buttons) rises
//   10px, 0.1s apart.
// - The things in a section's body (the cards of a grid, the columns of a
//   row) rise 20px, 0.1s apart; a body that is one thing rises whole.
//
// Everything takes 0.75s on the site's ease-out curve. A page's reveals wait
// until its figure is well in view (below), and play again once the figure
// has been scrolled wholly out of the window and back (Leo, 2026-11-20).
// The styles are `[data-reveal]` and `.cds-words` in src/claude-ds.css.
//
// The parts are found in the page as it stands (a hero is the first block,
// under the site's header; a section's parts are its children), so a page
// needs nothing of its own. Only a header's headline is the page's doing:
// `Header` writes it as words where this context says so.

/** Whether headlines are written a word at a time, to be revealed. */
export const RevealContext = createContext(false)

type Group = { watch: Element; items: Array<HTMLElement> }

const isBox = (el: Element): el is HTMLElement => el instanceof HTMLElement

/**
 * Marks a template page's parts for revealing, and reveals each group when
 * it comes into view. `find` gives the page (the `.cds-tpl` box).
 */
export function useReveals(find: () => Element | null | undefined) {
  useEffect(() => {
    const page = find()
    if (!page) return
    // An Anthropic.com page, made of `.ads` blocks, takes that site's own
    // reveals instead (src/components/work/anthropic/reveal.ts).
    if (page.querySelector(":scope > .ads")) return
    const words = Array.from(page.querySelectorAll<HTMLElement>(".cds-words"))
    const show = (el: Element) => el.setAttribute("data-revealed", "")
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach(show)
      return
    }

    const groups: Array<Group> = []
    const timers: Array<number> = []
    // How each part rises, kept to set it waiting again for another reveal.
    const marks = new Map<HTMLElement, () => void>()
    const mark = (
      watch: Element,
      items: Array<Element>,
      rise: number,
      apart: number
    ) => {
      const boxes = items.filter(isBox)
      boxes.forEach((item, i) => {
        const arm = () => {
          item.setAttribute("data-reveal", "")
          item.style.setProperty("--reveal-y", `${rise}px`)
          item.style.setProperty("--reveal-index", String(i))
          item.style.setProperty("--reveal-stagger", `${apart}s`)
        }
        marks.set(item, arm)
        arm()
      })
      if (boxes.length) groups.push({ watch, items: boxes })
    }

    // A header's parts: all of them in a hero; under a section's headline,
    // which comes in by its words, the rest.
    const header = (el: Element, hero: boolean) => {
      const parts = Array.from(el.firstElementChild?.children ?? [])
      if (hero) return parts
      const headline = parts.find((part) => part.matches(".cds-words"))
      if (headline && isBox(headline))
        groups.push({ watch: headline, items: [headline] })
      mark(
        el,
        parts.filter((part) => part !== headline),
        10,
        0.1
      )
      return []
    }
    // What a hero is made of: a header's parts, the lines of a column of
    // text (which may be one of two columns, beside a picture), or the
    // thing itself.
    const lines = (el: Element) =>
      Array.from(el.children).some((kid) => kid.matches("h3, p"))
    const heroParts = (el: Element, depth = 0): Array<Element> => {
      if (el.matches(".cds-header")) return header(el, true)
      // A card comes in whole, not by what is written on it.
      if (el.matches(".cds-margin, .cds-margin-card, form")) return [el]
      const kids = Array.from(el.children)
      const column = lines(el) && kids.length <= 6
      const columns =
        depth < 2 &&
        kids.length <= 4 &&
        kids.some((kid) => kid.matches(".cds-header") || lines(kid))
      return column || columns
        ? kids.flatMap((kid) => heroParts(kid, depth + 1))
        : [el]
    }
    // A section's parts: its header, and each thing under it, whose own
    // parts come in one after another where it is a row or grid of a few.
    const section = (el: Element, depth = 0) => {
      for (const child of Array.from(el.children)) {
        if (child.matches(".cds-header")) header(child, false)
        else if (depth < 2 && child.querySelector(".cds-header"))
          section(child, depth + 1)
        else {
          const kids = Array.from(child.children)
          const layout = getComputedStyle(child).display
          const row =
            kids.length > 1 &&
            kids.length <= 8 &&
            (layout === "grid" || layout === "flex")
          mark(child, row ? kids : [child], 20, 0.1)
        }
      }
    }

    Array.from(page.children).forEach((block, i) => {
      // The footer, and the Anthropic.com pages' call above it, are left
      // as they are.
      if (block.querySelector(".cds-footer, .ads-footer, .ads-prefooter"))
        return
      if (i > 0) return section(block)
      const under = Array.from(block.children).filter(
        (child) => !child.matches(".cds-nav, .ads-nav")
      )
      mark(
        block,
        under.flatMap((part) => heroParts(part)),
        16,
        0.12
      )
    })
    // A hero's headline is one of its parts: its words are simply there.
    for (const headline of words)
      if (headline.hasAttribute("data-reveal")) show(headline)

    // A group comes in when it is in view, and not before the figure itself
    // is well in view: across the middle of the window, not just peeking in
    // at its edge (Leo, 2026-11-19: "so that users don't miss the load/reveal
    // animations"). Until then what is in view waits, the hero included, so
    // a page's first reveal plays in front of whoever scrolled down to it.
    const figure = page.closest("[data-figure]") ?? page.parentElement ?? page
    const inView = new Set<Element>()
    let open = false
    let played = false
    const play = () => {
      if (!open) return
      for (const watch of inView) {
        observer.unobserve(watch)
        for (const group of groups) {
          if (group.watch !== watch) continue
          played = true
          group.items.forEach(show)
          // Once in, a part is let go of, back to its own styles.
          timers.push(
            window.setTimeout(
              () => group.items.forEach(release),
              900 + group.items.length * 120
            )
          )
        }
      }
      inView.clear()
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inView.add(entry.target)
          else inView.delete(entry.target)
        }
        play()
      },
      // In view once a little of it is above the window's bottom edge.
      { rootMargin: "0px 0px -8% 0px" }
    )
    for (const { watch } of groups) observer.observe(watch)
    // The figure is well in view while it lies across a line a little under
    // the middle of the window (the docs' bar takes the top of it).
    const gate = new IntersectionObserver(
      (entries) => {
        open = entries.some((entry) => entry.isIntersecting)
        play()
      },
      { rootMargin: "-55% 0px -45% 0px" }
    )
    gate.observe(figure)

    // Once the figure is wholly out of the window, every part that came in
    // waits again, unseen, so the page's reveals play again when it is
    // scrolled back to. A hero's headline keeps its words, as at first.
    const rewind = () => {
      if (!played) return
      played = false
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.length = 0
      inView.clear()
      for (const group of groups) {
        for (const item of group.items) {
          const arm = marks.get(item)
          arm?.()
          if (!(arm && item.matches(".cds-words")))
            item.removeAttribute("data-revealed")
        }
        observer.observe(group.watch)
      }
    }
    const away = new IntersectionObserver((entries) => {
      if (entries.every((entry) => !entry.isIntersecting)) rewind()
    })
    away.observe(figure)

    return () => {
      away.disconnect()
      gate.disconnect()
      observer.disconnect()
      timers.forEach((timer) => window.clearTimeout(timer))
      for (const { items } of groups) items.forEach(release)
    }
    // The page is found once, when it is first there.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

function release(item: HTMLElement) {
  if (!item.hasAttribute("data-reveal")) return
  item.removeAttribute("data-reveal")
  item.style.removeProperty("--reveal-y")
  item.style.removeProperty("--reveal-index")
  item.style.removeProperty("--reveal-stagger")
}
