import { createContext, useContext } from "react"

/**
 * The frame of the figure something is drawn in: the element around a
 * `figure` `Specimen`'s box (ui.tsx), which is exactly the size of the box
 * but does not clip. What has to sit on or across the figure's border lives
 * in it, not in the box: the grips of a `Resizable`, which narrows the frame
 * itself, and the demo cursor, which reaches those grips.
 */
export type Frame = {
  /** The element; null outside such a figure, and on its first render. */
  el: HTMLDivElement | null
  /** Gives the figure a width of its own; null is all the room there is. */
  setWidth: (width: number | null) => void
  /**
   * A place under the figure, outside it and at the page's own size, for a
   * line about it: the name of the layout a `Resizable` is showing.
   */
  note: HTMLDivElement | null
}

export const FrameContext = createContext<Frame>({
  el: null,
  setWidth: () => {},
  note: null,
})

export const useFrame = () => useContext(FrameContext)
