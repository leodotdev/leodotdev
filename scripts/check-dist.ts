// Refuse to deploy a build that contains local secrets. The Cloudflare Vite
// plugin copies .dev.vars into the build output when it exists at build time.
// Usage: node scripts/check-dist.ts [dir]   (dir defaults to "dist")
import { readdirSync } from "node:fs"
import { join } from "node:path"

function find(dir: string): Array<string> {
  let out: Array<string> = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out = out.concat(find(p))
    else if (
      e.name.startsWith(".dev.vars") ||
      e.name === ".env" ||
      e.name.startsWith(".env.")
    )
      out.push(p)
  }
  return out
}

const root = process.argv[2] ?? "dist"
let hits: Array<string> = []
try {
  hits = find(root)
} catch {
  console.error(`check-dist: no ${root}/ directory; build first`)
  process.exit(1)
}
if (hits.length) {
  console.error(
    `check-dist: refusing to deploy, secrets file(s) in the build: ${hits.join(", ")}`
  )
  process.exit(1)
}
console.log("check-dist: ok")
