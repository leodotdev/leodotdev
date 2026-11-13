import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import { THEME_COLOR, THEME_SCRIPT, ThemeProvider } from "@/lib/theme"
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
      {
        name: "theme-color",
        content: THEME_COLOR.light,
        media: "(prefers-color-scheme: light)",
      },
      {
        name: "theme-color",
        content: THEME_COLOR.dark,
        media: "(prefers-color-scheme: dark)",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
    ],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {/* #app is what the theme switch's wave covers: body can't be a target */}
          <div id="app" className="bg-background">
            <div className="site-frame mx-auto min-h-screen max-w-[960px] border-x bg-background">
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
