import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

import logoNav from "../assets/brand/logo-nav.svg"
import { consumeReportsReloadFlag } from "../pages/reports/lib/reports-reload"
import styles from "./ReloadSplash.module.css"

const SPLASH_VISIBLE_MS = 900
const SPLASH_FADE_MS = 220

/** Прапорець читаємо один раз за завантаження, інакше StrictMode з'їдає його на першому монтуванні. */
const startsVisible =
  typeof window === "undefined" ? false : consumeReportsReloadFlag()

export function ReloadSplash() {
  const [visible, setVisible] = useState(startsVisible)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return
    const hold = window.setTimeout(() => setLeaving(true), SPLASH_VISIBLE_MS)
    return () => window.clearTimeout(hold)
  }, [visible])

  useEffect(() => {
    if (!leaving) return
    const fade = window.setTimeout(() => setVisible(false), SPLASH_FADE_MS)
    return () => window.clearTimeout(fade)
  }, [leaving])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(styles.splash, leaving && styles.splashLeaving)}
    >
      <span className={styles.lockup}>
        <img
          src={logoNav}
          alt=""
          width={202}
          height={80}
          className={styles.logo}
        />
        <span className={styles.sweep} aria-hidden="true" />
      </span>
      <p className={styles.caption}>Оновлюємо звіт…</p>
      <span className={styles.progress} aria-hidden="true">
        <span className={styles.progressBar} />
      </span>
    </div>
  )
}
