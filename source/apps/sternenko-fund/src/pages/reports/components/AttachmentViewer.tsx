import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon, FileTextIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

export type DocumentAttachmentItem = {
  src: string
  alt: string
}

export type TransferMediaItem = {
  type: "image" | "video"
  src: string
  alt: string
  /** Poster frame for video preview in gallery and before play. */
  poster?: string
}

export type AttachmentViewerMode = "media" | "document"

type AttachmentViewerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  mode: AttachmentViewerMode
  mediaItems?: TransferMediaItem[]
  documentItems?: DocumentAttachmentItem[]
}

function TransferMediaSlide({ item }: { item: TransferMediaItem }) {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-3">
      {item.type === "video" ? (
        <video
          key={item.src}
          src={item.src}
          controls
          playsInline
          preload="metadata"
          poster={item.poster}
          className="max-h-[60vh] w-full max-w-full rounded-md bg-black"
          aria-label={item.alt}
        >
          Ваш браузер не підтримує відтворення відео.
        </video>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          className="max-h-[60vh] w-auto max-w-full rounded-md object-contain"
        />
      )}
      <p className="text-muted-foreground max-w-lg text-center text-sm">{item.alt}</p>
    </div>
  )
}

function DocumentSlide({ item }: { item: DocumentAttachmentItem }) {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-lg border bg-background p-8 text-center">
      <FileTextIcon className="text-muted-foreground size-16" aria-hidden />
      <div className="space-y-1">
        <p className="font-medium">{item.alt}</p>
        <p className="text-muted-foreground text-xs">Mock-попередній перегляд документа</p>
      </div>
      <img
        src={item.src}
        alt=""
        className="mt-2 max-h-48 w-full rounded border object-cover object-top opacity-90"
      />
    </div>
  )
}

export function AttachmentViewer({
  open,
  onOpenChange,
  title,
  mode,
  mediaItems = [],
  documentItems = [],
}: AttachmentViewerProps) {
  const items = mode === "media" ? mediaItems : documentItems
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, items.length)
  const currentPage = Math.min(page, pageCount)

  const goPrev = () => setPage((p) => Math.max(1, p - 1))
  const goNext = () => setPage((p) => Math.min(pageCount, p + 1))

  const currentMedia =
    mode === "media" ? mediaItems[currentPage - 1] : undefined
  const currentDocument =
    mode === "document" ? documentItems[currentPage - 1] : undefined

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setPage(1)
        onOpenChange(next)
      }}
    >
      <DialogContent
        className={cn(
          "flex max-h-[calc(100dvh-1rem)] w-full max-w-[calc(100vw-1rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl",
          mode === "media" && "sm:max-w-4xl"
        )}
        showCloseButton
      >
        <DialogHeader className="shrink-0 border-b px-4 py-3">
          <DialogTitle className="pr-10 text-base leading-snug break-words sm:text-lg">
            {title}
          </DialogTitle>
          {pageCount > 1 ? (
            <DialogDescription>
              {currentPage} з {pageCount}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        <div className="bg-muted/30 relative flex min-h-[200px] flex-1 items-center justify-center overflow-y-auto overscroll-contain p-3 sm:p-4 md:min-h-[360px]">
          {pageCount > 1 ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 z-10 size-10 min-h-6 min-w-6 -translate-y-1/2"
                disabled={currentPage <= 1}
                onClick={goPrev}
                aria-label="Попереднє"
              >
                <ChevronLeftIcon className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 z-10 size-10 min-h-6 min-w-6 -translate-y-1/2"
                disabled={currentPage >= pageCount}
                onClick={goNext}
                aria-label="Наступне"
              >
                <ChevronRightIcon className="size-4" aria-hidden />
              </Button>
            </>
          ) : null}

          {currentMedia ? <TransferMediaSlide item={currentMedia} /> : null}
          {currentDocument ? <DocumentSlide item={currentDocument} /> : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export type AttachmentKind = "media" | "act" | "payment"

const ATTACHMENT_TITLES: Record<AttachmentKind, string> = {
  media: "Фото та відео передачі",
  act: "Акт видачі",
  payment: "Платіжний документ",
}

export function attachmentViewerTitle(kind: AttachmentKind, productName: string) {
  return `${ATTACHMENT_TITLES[kind]} — ${productName}`
}

export function attachmentViewerMode(kind: AttachmentKind): AttachmentViewerMode {
  return kind === "media" ? "media" : "document"
}

/** @deprecated Use TransferMediaItem or DocumentAttachmentItem */
export type AttachmentItem = DocumentAttachmentItem
