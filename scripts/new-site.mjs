#!/usr/bin/env node
// Scaffold a client site from apps/_template.
//   pnpm new-site <name> [--theme <slug>]
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const appsDir = join(root, "apps")
const templateDir = join(appsDir, "_template")
const themesDir = join(root, "packages/tokens/themes")

/** Optional brand font CSS — imported only by sites that need them. */
const THEME_FONT_IMPORTS = {
  "sternenko-fund": 'import "@workspace/ui/sternenko-fund-fonts.css"',
  "ukrainian-institute": 'import "@workspace/ui/ukrainian-institute-fonts.css"',
}

const RESERVED = new Set(["_template", "web"])
const TEXT_EXTENSIONS = new Set([".ts", ".tsx", ".html", ".json", ".md", ".css"])

function parseArgs(argv) {
  const args = argv.slice(2)
  let name = null
  let theme = null

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--theme") {
      theme = args[++i]
      continue
    }
    if (arg.startsWith("--")) {
      console.error(`Unknown option: ${arg}`)
      process.exit(1)
    }
    if (!name) {
      name = arg
      continue
    }
    console.error(`Unexpected argument: ${arg}`)
    process.exit(1)
  }

  return { name, theme }
}

function isValidSlug(value) {
  return /^[a-z][a-z0-9-]*$/.test(value)
}

function walkFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      if (entry === "node_modules" || entry === "dist" || entry === ".turbo") continue
      files.push(...walkFiles(fullPath))
      continue
    }
    files.push(fullPath)
  }
  return files
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

const { name, theme: themeArg } = parseArgs(process.argv)

if (!name) {
  console.error("Usage: pnpm new-site <name> [--theme <slug>]")
  process.exit(1)
}

if (!isValidSlug(name)) {
  console.error(
    `Invalid site name "${name}". Use lowercase letters, digits and hyphens (e.g. ui-home).`
  )
  process.exit(1)
}

if (RESERVED.has(name)) {
  console.error(`"${name}" is reserved. Choose a different site name.`)
  process.exit(1)
}

const targetDir = join(appsDir, name)
if (existsSync(targetDir)) {
  console.error(`Site already exists: apps/${name}`)
  process.exit(1)
}

if (!existsSync(templateDir)) {
  console.error("Template not found: apps/_template")
  process.exit(1)
}

const theme = themeArg ?? name

if (!isValidSlug(theme)) {
  console.error(
    `Invalid theme slug "${theme}". Use lowercase letters, digits and hyphens.`
  )
  process.exit(1)
}

const themeFile = join(themesDir, `${theme}.css`)
if (!existsSync(themeFile)) {
  console.error(`Theme not found: packages/tokens/themes/${theme}.css`)
  console.error(`Create it first: pnpm create-theme ${theme}`)
  process.exit(1)
}

cpSync(templateDir, targetDir, { recursive: true })

const replacements = new Map([
  ["__SITE_NAME__", name],
  ["__THEME_SLUG__", theme],
  ["__SITE_TITLE__", titleFromSlug(name)],
  ["__THEME_FONTS_IMPORT__", THEME_FONT_IMPORTS[theme] ?? ""],
])

for (const filePath of walkFiles(targetDir)) {
  const ext = filePath.slice(filePath.lastIndexOf("."))
  if (!TEXT_EXTENSIONS.has(ext)) continue

  let content = readFileSync(filePath, "utf8")
  let changed = false

  for (const [from, to] of replacements) {
    if (content.includes(from)) {
      content = content.replaceAll(from, to)
      changed = true
    }
  }

  if (changed) writeFileSync(filePath, content)
}

console.log(`Created apps/${name} with theme "${theme}".`)
console.log("Installing workspace dependencies…")

const install = spawnSync("pnpm", ["install"], { cwd: root, stdio: "inherit" })
if (install.status !== 0) process.exit(install.status ?? 1)

console.log("")
console.log("Ready.")
console.log(`  Pages:  apps/${name}/src/pages/`)
console.log(`  Site:   pnpm --filter ${name} dev`)
console.log(`  Kit:    pnpm --filter @workspace/ui storybook`)
