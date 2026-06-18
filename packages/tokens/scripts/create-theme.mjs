#!/usr/bin/env node
// Scaffolds a new brand theme from _template.css.
//   pnpm create-theme <slug>
// Copies the template to themes/<slug>.css, swaps CLIENT_SLUG for the slug,
// registers the file in package.json exports, and prints the remaining steps.
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const themesDir = join(root, "themes")

const slug = process.argv[2]

if (!slug) {
  console.error("Usage: pnpm create-theme <slug>")
  process.exit(1)
}

if (!/^[a-z][a-z0-9-]*$/.test(slug)) {
  console.error(
    `Invalid slug "${slug}". Use lowercase letters, digits and hyphens (e.g. acme-corp).`
  )
  process.exit(1)
}

if (slug === "base" || slug === "_template") {
  console.error(`"${slug}" is reserved.`)
  process.exit(1)
}

const target = join(themesDir, `${slug}.css`)
if (existsSync(target)) {
  console.error(`Theme already exists: themes/${slug}.css`)
  process.exit(1)
}

const template = readFileSync(join(themesDir, "_template.css"), "utf8")
writeFileSync(target, template.replaceAll("CLIENT_SLUG", slug))

// Register the theme in package.json exports so apps can import it.
const pkgPath = join(root, "package.json")
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"))
const exportKey = `./themes/${slug}.css`
if (!pkg.exports[exportKey]) {
  pkg.exports[exportKey] = `./themes/${slug}.css`
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`)
}

console.log(`Created themes/${slug}.css and registered the export.\n`)
console.log("Next steps:")
console.log(`  1. Fill themes/${slug}.css with values from the brandbook.`)
console.log("  2. Add the brand font (@fontsource import or @font-face).")
console.log(
  `  3. Add "${slug}" to the Brand toolbar in packages/ui/.storybook/preview.tsx`
)
console.log(
  `     and import the CSS there + in your app's main.tsx.`
)
console.log("  4. Run `pnpm validate-themes` to confirm the contract is met.")
console.log(`  5. Preview every component in Storybook with Brand = ${slug}.`)
