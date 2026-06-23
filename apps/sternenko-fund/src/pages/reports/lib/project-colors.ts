import { ISSUANCE_PROJECT_LINES, type IssuanceProjectLine } from "../mock-data"

/** 5 лінійок проєктів — 5 унікальних кольорів (брендбук / report palettes). */
export const PROJECT_TAG_CLASS: Record<IssuanceProjectLine, string> = {
  Поточний: "bg-[#829474] text-[#1E1E1E]",
  Шахедоріз: "bg-[#FFD62E] text-[#1E1E1E]",
  Небесний: "bg-[#59CBE7] text-[#1E1E1E]",
  РеДрон: "bg-[#1C1C1C] text-white",
  Секретний: "bg-[#FE6A34] text-[#1E1E1E]",
}

export function getProjectTagClass(name: IssuanceProjectLine): string {
  return PROJECT_TAG_CLASS[name]
}

export function isIssuanceProjectLine(name: string): name is IssuanceProjectLine {
  return (ISSUANCE_PROJECT_LINES as readonly string[]).includes(name)
}
