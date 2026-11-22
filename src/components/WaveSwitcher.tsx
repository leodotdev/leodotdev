import { useSyncExternalStore } from "react"
import { useHydrated } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { loadWave, setWaves, subscribeWaves, wave, wavesOn } from "@/lib/wave"
import { notify } from "@/components/ui/toast"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * Switches the distortion wave on and off sitewide (`setWaves` in
 * src/lib/wave.ts): on unless the visitor turns it off, or starts off where
 * the system asks for reduced motion. A 20px ball beside the light switch,
 * with the same 40px hit area: the wave's own colors swept round like a
 * beachball (`.wave-ball` in src/styles.css), gray while waves are off.
 * Switched back on, it sends one wave across the page from the ball.
 */
export function WaveSwitcher({ className }: { className?: string }) {
  const hydrated = useHydrated()
  const on = useSyncExternalStore(subscribeWaves, wavesOn, () => true)
  const classes = cn(
    "relative grid h-5 w-5 shrink-0 place-items-center rounded-full [corner-shape:round] before:absolute before:-inset-2.5 before:content-['']",
    className
  )

  // The pick is only known in the browser: hold the space until hydration,
  // as the light switch does.
  if (!hydrated) return <span aria-hidden className={classes} />

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label="Waves"
            aria-pressed={on}
            data-wave-manual
            data-wave-hover="off"
            onClick={(e) => {
              const source = e.currentTarget
              const focus = e.nativeEvent
              setWaves(!on)
              notify(on ? "Waves turned off" : "Waves turned on")
              if (on) return
              // Back on: one wave over the page, from the ball, with the
              // light switch's settings (nothing gathers on a 20px dot).
              void loadWave().then(() =>
                wave(document.getElementById("app"), undefined, {
                  source,
                  focus,
                  gatherGlow: 0,
                  gatherDots: 0,
                  holdScale: 5,
                })
              )
            }}
            className={classes}
          >
            <span
              className="wave-ball h-5 w-5 rounded-full [corner-shape:round]"
              data-on={on || undefined}
            />
          </button>
        }
      />
      <TooltipContent>Waves</TooltipContent>
    </Tooltip>
  )
}
