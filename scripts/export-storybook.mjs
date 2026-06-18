#!/usr/bin/env node
// Copy a built Storybook static export into an app folder.
//   node scripts/export-storybook.mjs <app-name>
import { cpSync, existsSync, rmSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const appName = process.argv[2]

if (!appName) {
  console.error("Usage: node scripts/export-storybook.mjs <app-name>")
  process.exit(1)
}

const source = join(root, "packages/ui/storybook-static")
const dest = join(root, "apps", appName, "dist")

if (!existsSync(source)) {
  console.error(`Storybook build not found: ${source}`)
  console.error("Run build-storybook first.")
  process.exit(1)
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true })
}

cpSync(source, dest, { recursive: true })
console.log(`Storybook exported to apps/${appName}/dist/`)
