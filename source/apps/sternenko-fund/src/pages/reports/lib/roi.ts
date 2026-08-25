export type DonationEfficiency = {
  incomeUah: number
  lossesUsd: number
  /** Скільки $ збитків ворогу припадає на 1 ₴ донату. */
  usdPerUah: number
}

export function computeDonationEfficiency(
  incomeUah: number,
  lossesUsd: number
): DonationEfficiency {
  return {
    incomeUah,
    lossesUsd,
    usdPerUah: incomeUah > 0 ? lossesUsd / incomeUah : 0,
  }
}

/** uk-UA кома; менше десятки — два знаки після коми. */
export function formatUsdPerUah(value: number): string {
  const digits = value >= 10 ? 0 : 2
  return new Intl.NumberFormat("uk-UA", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

/** Ефективність донату — однозначне формулювання. */
export function formatDonationImpactRate(usdPerUah: number): string {
  return `кожна ₴1 → $${formatUsdPerUah(usdPerUah)} збитків ворогу`
}

/** @deprecated use formatDonationImpactRate */
export function formatUahToUsdRate(usdPerUah: number): string {
  return formatDonationImpactRate(usdPerUah)
}
