import { Toast } from "@base-ui/react/toast"

/**
 * The site's toasts: a short note at the bottom center of the window saying
 * what a switch just did (Leo, 2026-11-21: the light switch, the waves
 * switch, the docs' theme dots, and their spacing switch). One shows at a
 * time: a new note sends the last one away. Each leaves after a couple of
 * seconds, sooner than Base UI's default, since it only confirms a change
 * already on screen. Screen readers hear it politely.
 *
 * The manager is the module's own, so a switch calls `notify` without a hook;
 * `Toaster` (in the `_site` layout) draws what it holds, in a portal outside
 * `#app`, so a wave playing over the page never pictures it, and above the
 * wave's canvas (z-index 2147483000), so the note shows while the wave that
 * carries the change is still playing. The back-to-top
 * button reads the same manager (`useToastManager`) to rise above a note.
 */
export const toasts = Toast.createToastManager()

/** Says what just happened, in a few words. */
export function notify(title: string) {
  toasts.close()
  toasts.add({ title, timeout: 2400 })
}

/** The provider for `toasts`, with the place they are drawn. */
export function Toaster({ children }: { children?: React.ReactNode }) {
  return (
    <Toast.Provider toastManager={toasts}>
      {children}
      <Toast.Portal>
        <Toast.Viewport
          data-no-wave
          className="pointer-events-none fixed inset-x-0 bottom-[max(24px,env(safe-area-inset-bottom))] z-[2147483002] flex justify-center"
        >
          <Notes />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}

function Notes() {
  const { toasts: list } = Toast.useToastManager()
  return list.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      swipeDirection="down"
      className="toast pointer-events-auto absolute bottom-0 flex h-[38px] items-center rounded-full bg-foreground px-4 text-background [corner-shape:round]"
    >
      <Toast.Title className="text-base font-semibold whitespace-nowrap" />
    </Toast.Root>
  ))
}

/** Whether a note is showing (and not on its way out). */
export function useToastShowing() {
  const { toasts: list } = Toast.useToastManager()
  return list.some((toast) => toast.transitionStatus !== "ending")
}
