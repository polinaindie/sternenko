export type Attachment = {
  type: "photo" | "act" | "payment"
  url: string
}

export type FeedItem = {
  id: string
  productName: string
  totalUAH: number
  unitCount: number
  unitPriceUAH: number
  project: string
  recipient: string
  attachments: Attachment[]
}

export type FeedDay = {
  date: string
  items: FeedItem[]
}
