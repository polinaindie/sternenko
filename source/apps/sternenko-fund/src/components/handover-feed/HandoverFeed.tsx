import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import {
  IconChevronDown,
  IconFileText,
  IconPaperclip,
  IconPhoto,
  IconReceipt,
} from "@tabler/icons-react"

import styles from "./HandoverFeed.module.css"
import type { Attachment, FeedDay, FeedItem } from "./types"

export type { Attachment, FeedDay, FeedItem } from "./types"

type HandoverFeedProps = {
  days: FeedDay[]
}

const uahFormatter = new Intl.NumberFormat("uk-UA", {
  maximumFractionDigits: 0,
})

function formatUAH(value: number): string {
  return `${uahFormatter.format(Math.round(value))} ₴`
}

function formatUnitPrice(value: number): string {
  return `${uahFormatter.format(Math.round(value))} ₴`
}

function formatDayHeader(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`)
  const weekdayRaw = new Intl.DateTimeFormat("uk-UA", { weekday: "short" }).format(
    date
  )
  const weekday =
    weekdayRaw.charAt(0).toUpperCase() + weekdayRaw.slice(1).replace(/\.$/, "")
  const datePart = new Intl.DateTimeFormat("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
  return `${weekday}, ${datePart}`
}

function sumDayTotal(items: FeedItem[]): number {
  return items.reduce((sum, item) => sum + Math.round(item.totalUAH), 0)
}

function useMediaTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 48rem)")
    const update = () => setIsTablet(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return isTablet
}

const ATTACHMENT_META: Record<
  Attachment["type"],
  { label: string; Icon: typeof IconPhoto }
> = {
  photo: { label: "Фото/відео", Icon: IconPhoto },
  act: { label: "Акт", Icon: IconFileText },
  payment: { label: "Платіж", Icon: IconReceipt },
}

function readSiteHeaderOffsetPx(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--site-header-offset")
    .trim()
  if (!raw) return 62
  if (raw.endsWith("rem")) {
    const rem = parseFloat(raw)
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    return Number.isFinite(rem) && Number.isFinite(root) ? rem * root : 62
  }
  const px = parseFloat(raw)
  return Number.isFinite(px) ? px : 62
}

function StickyDayHeader({
  date,
  totalUAH,
}: {
  date: string
  totalUAH: number
}) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    let observer: IntersectionObserver | null = null

    const connect = () => {
      observer?.disconnect()
      const offset = readSiteHeaderOffsetPx()
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry) setIsStuck(!entry.isIntersecting)
        },
        { threshold: 0, rootMargin: `-${offset + 1}px 0px 0px 0px` }
      )
      observer.observe(sentinel)
    }

    connect()
    window.addEventListener("resize", connect)
    return () => {
      window.removeEventListener("resize", connect)
      observer?.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={sentinelRef} className={styles.sentinel} aria-hidden />
      <div
        className={`${styles.dayHeader} ${isStuck ? styles.dayHeaderStuck : ""}`}
      >
        <span className={styles.dayHeaderDate}>{formatDayHeader(date)}</span>
        <span className={styles.dayHeaderTotal}>{formatUAH(totalUAH)}</span>
      </div>
    </>
  )
}

function AttachmentsAccordion({
  item,
  defaultOpen,
}: {
  item: FeedItem
  defaultOpen: boolean
}) {
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)

  useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])
  const count = item.attachments.length

  const toggle = useCallback(() => {
    setOpen((current) => !current)
  }, [])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        toggle()
      }
    },
    [toggle]
  )

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={styles.accordionTrigger}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        onKeyDown={onKeyDown}
      >
        <span className={styles.accordionTriggerLeft}>
          <IconPaperclip className={styles.accordionTriggerIcon} aria-hidden />
          <span>
            Вкладення
            <span className={styles.accordionTriggerCount}> · {count}</span>
          </span>
        </span>
        <IconChevronDown
          className={`${styles.accordionChevron} ${open ? styles.accordionChevronOpen : ""}`}
          aria-hidden
        />
      </button>
      {open ? (
        <div id={panelId} className={styles.accordionPanel} role="region">
          <div className={styles.attachmentGrid}>
            {item.attachments.map((attachment) => {
              const meta = ATTACHMENT_META[attachment.type]
              const { Icon } = meta
              return (
                <a
                  key={`${item.id}-${attachment.type}-${attachment.url}`}
                  href={attachment.url}
                  className={styles.attachmentTile}
                  aria-label={`${meta.label}: ${item.productName}`}
                >
                  <Icon className={styles.attachmentTileIcon} aria-hidden />
                  <span className={styles.attachmentTileLabel}>{meta.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function HandoverFeedCard({
  item,
  defaultAttachmentsOpen,
}: {
  item: FeedItem
  defaultAttachmentsOpen: boolean
}) {
  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <h3 className={styles.productName}>{item.productName}</h3>
          <div className={styles.amountBlock}>
            <p className={styles.amountTotal}>{formatUAH(item.totalUAH)}</p>
            <p className={styles.amountSub}>
              {item.unitCount} шт × {formatUnitPrice(item.unitPriceUAH)}
            </p>
          </div>
        </div>

        <div className={styles.metaBlock}>
          <div className={styles.metaField}>
            <span className={styles.microLabel}>Проєкт / збір</span>
            <span className={styles.chip}>{item.project}</span>
          </div>
          <div className={styles.metaField}>
            <span className={styles.microLabel}>Кому передали</span>
            <p className={styles.recipient}>{item.recipient}</p>
          </div>
        </div>
      </div>

      <AttachmentsAccordion item={item} defaultOpen={defaultAttachmentsOpen} />
    </article>
  )
}

export function HandoverFeed({ days }: HandoverFeedProps) {
  const isTablet = useMediaTablet()

  const groups = useMemo(
    () =>
      days.map((day) => ({
        ...day,
        dayTotal: sumDayTotal(day.items),
      })),
    [days]
  )

  return (
    <div className={styles.feed} aria-label="Журнал передач">
      {groups.map((group) => (
        <section key={group.date} className={styles.dayGroup} aria-label={group.date}>
          <StickyDayHeader date={group.date} totalUAH={group.dayTotal} />
          <ul className={styles.dayItems}>
            {group.items.map((item) => (
              <li key={item.id}>
                <HandoverFeedCard
                  item={item}
                  defaultAttachmentsOpen={isTablet}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
