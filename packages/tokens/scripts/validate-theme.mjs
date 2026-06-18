#!/usr/bin/env node
// Validates the Theme Contract:
//  - each brand theme file must override brand + appearance tokens
//  - base.css must provide the structural typography/spacing/stroke primitives
// Fails CI if any required token is missing.
import { readFileSync, readdirSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const contract = JSON.parse(readFileSync(join(root, "contract.json"), "utf8"))
const themesDir = join(root, "themes")

// Tokens a brand theme must declare to count as a complete re-skin.
const perThemeTokens = [...contract.brand, ...contract.appearance]
// Structural primitives expected in base.css (shared, not per brand).
const baseTokens = [
  ...contract.typography,
  ...contract.spacing,
  ...contract.stroke,
  ...contract.layout,
]

function missingTokens(css, tokens) {
  return tokens.filter((token) => !css.includes(`${token}:`))
}

let failed = false

function check(file, tokens) {
  const css = readFileSync(join(themesDir, file), "utf8")
  const missing = missingTokens(css, tokens)
  if (missing.length > 0) {
    failed = true
    console.error(`✗ ${file} missing: ${missing.join(", ")}`)
  } else {
    console.log(`✓ ${file}`)
  }
}

// base.css holds the structural primitives.
check("base.css", baseTokens)

// Every other theme file is a brand re-skin.
for (const file of readdirSync(themesDir)) {
  if (!file.endsWith(".css") || file === "base.css") continue
  check(file, perThemeTokens)
}

if (failed) {
  console.error("\nTheme validation failed.")
  process.exit(1)
}
console.log("\nAll themes satisfy the contract.")
