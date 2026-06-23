import transferActIcon from "../../../assets/transfer-act-icon.png"
import transferMediaIcon from "../../../assets/transfer-media-icon.png"
import transferPaymentIcon from "../../../assets/transfer-payment-icon.png"

const ATTACHMENT_ICON_BOX_CLASS = "inline-flex size-7 shrink-0 items-center justify-center"

const attachmentIconScales = {
  media: 1,
  act: 1.05,
  payment: 1.18,
} as const

function TransferAttachmentIcon({
  src,
  visualScale,
}: {
  src: string
  visualScale: number
}) {
  return (
    <span aria-hidden className={ATTACHMENT_ICON_BOX_CLASS}>
      <img
        src={src}
        alt=""
        draggable={false}
        className="size-full object-contain"
        style={
          visualScale === 1
            ? undefined
            : { transform: `scale(${visualScale})` }
        }
      />
    </span>
  )
}

export function TransferMediaIcon(_props: { className?: string }) {
  return (
    <TransferAttachmentIcon
      src={transferMediaIcon}
      visualScale={attachmentIconScales.media}
    />
  )
}

export function TransferActIcon(_props: { className?: string }) {
  return (
    <TransferAttachmentIcon
      src={transferActIcon}
      visualScale={attachmentIconScales.act}
    />
  )
}

export function TransferPaymentIcon(_props: { className?: string }) {
  return (
    <TransferAttachmentIcon
      src={transferPaymentIcon}
      visualScale={attachmentIconScales.payment}
    />
  )
}
