import { cpSync, mkdirSync, rmSync, watch, writeFileSync } from "node:fs"
import { spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const previewRoot = path.join(root, ".preview")
const appRoot = path.join(previewRoot, "sternenko")
const dist = path.join(root, "dist")

function syncDistToPreview() {
  cpSync(dist, appRoot, { recursive: true })
}

rmSync(previewRoot, { recursive: true, force: true })
mkdirSync(appRoot, { recursive: true })
syncDistToPreview()

writeFileSync(
  path.join(previewRoot, "index.html"),
  `<!doctype html>
<html lang="uk">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=/sternenko/" />
    <script>location.replace("/sternenko/")</script>
    <title>Звіти — БФ «Спільнота Стерненка»</title>
  </head>
  <body>
    <p><a href="/sternenko/">Перейти до звітів</a></p>
  </body>
</html>
`
)

let syncTimer = null
watch(dist, { recursive: true }, () => {
  clearTimeout(syncTimer)
  syncTimer = setTimeout(() => {
    syncDistToPreview()
    console.log("\n  ↻  dist synced to preview — перезавантажте сторінку\n")
  }, 300)
})

const vite = spawn(
  "pnpm",
  ["exec", "vite", "preview", "--outDir", previewRoot, "--port", "5173", "--host"],
  { cwd: root, stdio: "inherit", shell: true }
)

vite.on("exit", (code) => process.exit(code ?? 0))

process.on("SIGINT", () => vite.kill("SIGINT"))
process.on("SIGTERM", () => vite.kill("SIGTERM"))

console.log("\n  ➜  App: http://localhost:5173/sternenko/\n")
