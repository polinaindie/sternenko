/**
 * Sternenko brandbook — 6 colour families × 4 shades (dark → light).
 * Source: brand palette reference (Yellow, Orange, Brown, Green, Blue, Grayscale).
 */
export const BRAND_PALETTE = {
  gray: { dark: "#000000", main: "#1A1A1A", mid: "#666666", light: "#D9D9D9" },
  yellow: { dark: "#6B5B1E", main: "#FFD23F", mid: "#FFE69C", light: "#F5F1E1" },
  orange: { dark: "#632C18", main: "#FF6B35", mid: "#FFB79D", light: "#FEE5DC" },
  brown: { dark: "#261D13", main: "#A67C52", mid: "#D1BFA6", light: "#F0E9E1" },
  green: { dark: "#1A2319", main: "#6B815C", mid: "#B4C1A9", light: "#E9ECE5" },
  blue: { dark: "#1A343D", main: "#4392AC", mid: "#66D2ED", light: "#E1F5FA" },
} as const

export const BRAND_INK = "#1E1E1E"
export const BRAND_INK_ON_DARK = "#FFFFFF"
export const BRAND_INK_ON_WARM = "#F0E9E1"

export type BrandSwatch = { bg: string; fg: string }
