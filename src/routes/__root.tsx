import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { DEFAULT, THEME_COLOR, THEME_SCRIPT, ThemeProvider } from "@/lib/theme"
import { WaveEffects } from "@/components/WaveEffects"
import { Button } from "@/components/ui/button"

import appCss from "../styles.css?url"

const TITLE = "leo.dev"
const DESCRIPTION = "Web, Software, Product Designer"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: "Leo SF" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://leo.dev" },
      { property: "og:site_name", content: "leo.dev" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Leo SF" },
      { name: "twitter:description", content: DESCRIPTION },
      // The default theme's color; the theme script and provider keep it on
      // the theme in use.
      { name: "theme-color", content: THEME_COLOR[DEFAULT] },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        href: "/favicon.svg",
        type: "image/svg+xml",
        sizes: "any",
      },
    ],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    // The server's HTML is in the default theme (dark); the script in the head
    // switches it for a visitor who picked light, before the first paint.
    <html
      lang="en"
      className={DEFAULT === "dark" ? "dark" : undefined}
      style={{ colorScheme: DEFAULT }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {/* #app is what the theme switch's wave covers: body can't be a target */}
          <div id="app" className="overflow-x-clip bg-background">
            {/* The page: a 960px column with no lines down its sides (Leo,
                2026-11-19, "let's try": it had a border on each side from
                961px). */}
            <div className="site-frame mx-auto min-h-screen max-w-[960px] bg-background">
              {children}
            </div>
          </div>
          <WaveEffects />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
      <h1 className="font-semibold">404</h1>
      <p className="text-muted-foreground">This page could not be found.</p>
      <Button variant="pill" className="mt-4" render={<Link to="/" />}>
        Back to home
      </Button>
    </main>
  )
}
