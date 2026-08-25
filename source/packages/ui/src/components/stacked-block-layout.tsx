import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

const CONNECTOR_BAR_PATH =
  "M334 0C329.858 0 326.5 3.35787 326.5 7.5C326.5 11.6421 329.858 15 334 15H0C4.14214 15 7.5 11.6421 7.5 7.5C7.5 3.35786 4.14214 0 0 0H334Z"

const DEFAULT_BLOCK_COLOR = "#7F9A6F"
const GUTTER_SIZE = 15
const BLOCK_RADIUS = 12
const BLOCK_RADIUS_TOP = `${BLOCK_RADIUS}px ${BLOCK_RADIUS}px 0 0`
const BLOCK_RADIUS_BOTTOM = `0 0 ${BLOCK_RADIUS}px ${BLOCK_RADIUS}px`
const BLOCK_RADIUS_TOP_LEFT = `${BLOCK_RADIUS}px 0 0 0`
const BLOCK_RADIUS_TOP_RIGHT = `0 ${BLOCK_RADIUS}px 0 0`
const CONNECTOR_WIDTH_RATIO = 0.7
/** Закриває субпіксельний зазор між блоком і SVG-конектором. */
const CONNECTOR_SEAM_OVERLAP = 2
const HERO_MAX_HEIGHT = 390
const ROW_HEIGHT = 160

const THREE_COLUMN_TEMPLATE = `minmax(0, 1fr) ${GUTTER_SIZE}px minmax(0, 1fr) ${GUTTER_SIZE}px minmax(0, 1fr)`
const TWO_COLUMN_TEMPLATE = `minmax(0, 3fr) ${GUTTER_SIZE}px minmax(0, 5fr)`
const EQUAL_TWO_COLUMN_TEMPLATE = `minmax(0, 1fr) ${GUTTER_SIZE}px minmax(0, 1fr)`
const SINGLE_COLUMN_TEMPLATE = "minmax(0, 1fr)"

type ConnectorBarProps = {
  className?: string
  fill?: string
}

function ConnectorBar({ className, fill = "currentColor" }: ConnectorBarProps) {
  return (
    <div className={cn("relative size-full", className)}>
      <svg
        viewBox="0 0 334 15"
        preserveAspectRatio="none"
        className="block size-full [shape-rendering:geometricPrecision]"
        aria-hidden
      >
        <path d={CONNECTOR_BAR_PATH} fill={fill} />
      </svg>
    </div>
  )
}

type SharedLayoutProps = {
  hero: React.ReactNode
  heroPosition?: "top" | "bottom"
  blockColor?: string
  backgroundColor?: string
  className?: string
  heroClassName?: string
  blockClassName?: string
  /** `auto` — компактний hero (заголовок); число — max-height у px (за замовч. 390). */
  heroMaxHeight?: number | "auto"
}

type ContentStackedBlockLayoutProps = SharedLayoutProps & {
  content: React.ReactNode
  contentClassName?: string
  /** Два рівні KPI-блоки над hero (50/50). */
  metricPair?: [React.ReactNode, React.ReactNode]
  metricRow?: never
  row1Left?: never
  row1Right?: never
  row2Left?: never
  row2Right?: never
}

type TwoRowStackedBlockLayoutProps = SharedLayoutProps & {
  content?: never
  metricRow?: never
  row1Left: React.ReactNode
  row1Right: React.ReactNode
  row2Left: React.ReactNode
  row2Right?: React.ReactNode | null
}

type ThreeRowStackedBlockLayoutProps = SharedLayoutProps & {
  content?: never
  /** Three equal blocks — opposite the hero (below when hero is on top). */
  metricRow: [React.ReactNode, React.ReactNode, React.ReactNode]
  row1Left?: never
  row1Right?: never
  row2Left?: never
  row2Right?: never
}

type StackedBlockLayoutProps =
  | ContentStackedBlockLayoutProps
  | TwoRowStackedBlockLayoutProps
  | ThreeRowStackedBlockLayoutProps

function StackedBlockLayout(props: StackedBlockLayoutProps) {
  if ("content" in props && props.content != null) {
    return <HeroContentStackedBlockLayout {...props} />
  }

  if ("metricRow" in props && props.metricRow) {
    return <ThreeColumnStackedBlockLayout {...props} />
  }

  return <TwoColumnStackedBlockLayout {...(props as TwoRowStackedBlockLayoutProps)} />
}

function heroRowSize(heroMaxHeight: number | "auto" | undefined): string {
  if (heroMaxHeight === "auto") return "auto"
  return `minmax(0, ${heroMaxHeight ?? HERO_MAX_HEIGHT}px)`
}

function HeroContentStackedBlockLayout({
  hero,
  content,
  metricPair,
  heroPosition = "top",
  blockColor = DEFAULT_BLOCK_COLOR,
  backgroundColor,
  className,
  heroClassName,
  blockClassName,
  contentClassName,
  heroMaxHeight = "auto",
}: ContentStackedBlockLayoutProps) {
  if (metricPair) {
    return (
      <MetricPairHeroContentStackedBlockLayout
        hero={hero}
        content={content}
        metricPair={metricPair}
        heroPosition={heroPosition}
        blockColor={blockColor}
        backgroundColor={backgroundColor}
        className={className}
        heroClassName={heroClassName}
        blockClassName={blockClassName}
        contentClassName={contentClassName}
        heroMaxHeight={heroMaxHeight}
      />
    )
  }

  const blockStyle = { backgroundColor: blockColor }
  const heroOnBottom = heroPosition === "bottom"
  const heroSize = heroRowSize(heroMaxHeight)

  const gridTemplateRows = heroOnBottom
    ? `minmax(0, auto) ${GUTTER_SIZE}px ${heroSize}`
    : `${heroSize} ${GUTTER_SIZE}px minmax(0, auto)`

  const heroRow = heroOnBottom ? 3 : 1
  const connectorRow = 2
  const contentRow = heroOnBottom ? 1 : 3

  return (
    <div
      data-slot="stacked-block-layout"
      data-layout="hero-content"
      data-hero-position={heroPosition}
      className={cn("grid w-full min-w-0", className)}
      style={{
        backgroundColor,
        gridTemplateColumns: SINGLE_COLUMN_TEMPLATE,
        gridTemplateRows,
      }}
    >
      <div
        data-slot="stacked-block-layout-hero"
        className={cn(
          "col-span-full min-h-0 overflow-hidden p-5 md:p-6",
          heroMaxHeight !== "auto" && "max-h-[390px]",
          heroClassName
        )}
        style={{
          ...blockStyle,
          gridRow: heroRow,
          gridColumn: 1,
          borderRadius: BLOCK_RADIUS,
          position: "relative",
          zIndex: 2,
          ...(!heroOnBottom && { marginBottom: -CONNECTOR_SEAM_OVERLAP }),
          ...(heroOnBottom && { marginTop: -CONNECTOR_SEAM_OVERLAP }),
        }}
      >
        {hero}
      </div>

      <ConnectorGapCell
        gridRow={connectorRow}
        gridColumn={1}
        blockColor={blockColor}
      />

      <StackedBlockCell
        gridRow={contentRow}
        gridColumn={1}
        className={cn("p-5 md:p-6", contentClassName)}
        style={{
          ...blockStyle,
          borderRadius: BLOCK_RADIUS,
          position: "relative",
          zIndex: 2,
          ...(!heroOnBottom && {
            boxShadow: `0 -${CONNECTOR_SEAM_OVERLAP}px 0 0 ${blockColor}`,
          }),
        }}
      >
        {content}
      </StackedBlockCell>
    </div>
  )
}

function MetricPairHeroContentStackedBlockLayout({
  hero,
  content,
  metricPair,
  blockColor = DEFAULT_BLOCK_COLOR,
  backgroundColor,
  className,
  heroClassName,
  blockClassName,
  contentClassName,
  heroMaxHeight = "auto",
}: ContentStackedBlockLayoutProps & {
  metricPair: [React.ReactNode, React.ReactNode]
}) {
  const blockStyle = { backgroundColor: blockColor }
  const heroSize = heroRowSize(heroMaxHeight)

  return (
    <div
      data-slot="stacked-block-layout"
      data-layout="metric-pair-hero-content"
      data-hero-position="top"
      className={cn("grid w-full min-w-0", className)}
      style={{
        backgroundColor,
        gridTemplateColumns: EQUAL_TWO_COLUMN_TEMPLATE,
        gridTemplateRows: `auto ${GUTTER_SIZE}px ${heroSize} ${GUTTER_SIZE}px minmax(0, auto)`,
      }}
    >
      <StackedBlockCell
        gridRow={1}
        gridColumn={1}
        className={cn("p-5 md:p-6", blockClassName)}
        style={{ ...blockStyle, borderRadius: BLOCK_RADIUS_TOP_LEFT }}
      >
        {metricPair[0]}
      </StackedBlockCell>
      <GutterCrossCell gridRow={1} gridColumn={2} />
      <StackedBlockCell
        gridRow={1}
        gridColumn={3}
        className={cn("p-5 md:p-6", blockClassName)}
        style={{ ...blockStyle, borderRadius: BLOCK_RADIUS_TOP_RIGHT }}
      >
        {metricPair[1]}
      </StackedBlockCell>

      <ConnectorGapCell gridRow={2} gridColumn={1} blockColor={blockColor} />
      <GutterCrossCell gridRow={2} gridColumn={2} />
      <ConnectorGapCell gridRow={2} gridColumn={3} blockColor={blockColor} />

      <div
        data-slot="stacked-block-layout-hero"
        className={cn(
          "min-h-0 overflow-hidden p-5 md:p-6",
          heroMaxHeight !== "auto" && "max-h-[390px]",
          heroClassName
        )}
        style={{
          ...blockStyle,
          gridRow: 3,
          gridColumn: "1 / -1",
          marginTop: -CONNECTOR_SEAM_OVERLAP,
        }}
      >
        {hero}
      </div>

      <FullWidthConnectorCell gridRow={4} blockColor={blockColor} />

      <StackedBlockCell
        gridRow={5}
        gridColumn="1 / -1"
        className={cn("p-5 md:p-6", contentClassName)}
        style={{
          ...blockStyle,
          borderRadius: BLOCK_RADIUS_BOTTOM,
          marginTop: -CONNECTOR_SEAM_OVERLAP,
        }}
      >
        {content}
      </StackedBlockCell>
    </div>
  )
}

function FullWidthConnectorCell({
  gridRow,
  blockColor,
}: GridPositionProps & { blockColor: string }) {
  return (
    <div
      className="relative z-[1] flex min-h-0 min-w-0 items-stretch justify-center"
      style={{
        gridRow,
        gridColumn: "1 / -1",
        height: GUTTER_SIZE,
        marginTop: -CONNECTOR_SEAM_OVERLAP,
        marginBottom: -CONNECTOR_SEAM_OVERLAP,
      }}
    >
      <div
        className="h-full"
        style={{ width: `${CONNECTOR_WIDTH_RATIO * 100}%` }}
      >
        <ConnectorBar fill={blockColor} />
      </div>
    </div>
  )
}

function ThreeColumnStackedBlockLayout({
  hero,
  metricRow,
  heroPosition = "top",
  blockColor = DEFAULT_BLOCK_COLOR,
  backgroundColor,
  className,
  heroClassName,
  blockClassName,
  heroMaxHeight,
}: ThreeRowStackedBlockLayoutProps) {
  const blockStyle = { backgroundColor: blockColor }
  const heroOnBottom = heroPosition === "bottom"
  const blockColumns = [1, 3, 5] as const
  const gutterColumns = [2, 4] as const

  const gridTemplateRows = heroOnBottom
    ? `${ROW_HEIGHT}px ${GUTTER_SIZE}px ${heroRowSize(heroMaxHeight)}`
    : `${heroRowSize(heroMaxHeight)} ${GUTTER_SIZE}px ${ROW_HEIGHT}px`

  const blockRow = heroOnBottom ? 1 : 3
  const connectorRow = 2
  const heroRow = heroOnBottom ? 3 : 1

  return (
    <div
      data-slot="stacked-block-layout"
      data-layout="three-column"
      data-hero-position={heroPosition}
      className={cn("grid w-full min-w-0", className)}
      style={{
        backgroundColor,
        gridTemplateColumns: THREE_COLUMN_TEMPLATE,
        gridTemplateRows,
      }}
    >
      <div
        data-slot="stacked-block-layout-hero"
        className={cn(
          "col-span-full min-h-0 overflow-hidden p-5 md:p-6",
          heroMaxHeight !== "auto" && "max-h-[390px]",
          heroClassName
        )}
        style={{
          ...blockStyle,
          gridRow: heroRow,
          gridColumn: "1 / -1",
          borderRadius: BLOCK_RADIUS,
        }}
      >
        {hero}
      </div>

      {blockColumns.map((column, index) => (
        <StackedBlockCell
          key={`block-${column}`}
          gridRow={blockRow}
          gridColumn={column}
          className={blockClassName}
          style={blockStyle}
        >
          {metricRow[index]}
        </StackedBlockCell>
      ))}

      {gutterColumns.map((column) => (
        <GutterCrossCell
          key={`block-gutter-${column}`}
          gridRow={blockRow}
          gridColumn={column}
        />
      ))}

      {blockColumns.map((column) => (
        <ConnectorGapCell
          key={`connector-${column}`}
          gridRow={connectorRow}
          gridColumn={column}
          blockColor={blockColor}
        />
      ))}

      {gutterColumns.map((column) => (
        <GutterCrossCell
          key={`connector-gutter-${column}`}
          gridRow={connectorRow}
          gridColumn={column}
        />
      ))}
    </div>
  )
}

function TwoColumnStackedBlockLayout({
  hero,
  row1Left,
  row1Right,
  row2Left,
  row2Right = null,
  heroPosition = "top",
  blockColor = DEFAULT_BLOCK_COLOR,
  backgroundColor,
  className,
  heroClassName,
  blockClassName,
  heroMaxHeight,
}: TwoRowStackedBlockLayoutProps) {
  const blockStyle = { backgroundColor: blockColor }
  const heroOnBottom = heroPosition === "bottom"

  const gridTemplateRows = heroOnBottom
    ? `${ROW_HEIGHT}px ${GUTTER_SIZE}px ${ROW_HEIGHT}px ${GUTTER_SIZE}px ${heroRowSize(heroMaxHeight)}`
    : `${heroRowSize(heroMaxHeight)} ${GUTTER_SIZE}px ${ROW_HEIGHT}px ${GUTTER_SIZE}px ${ROW_HEIGHT}px`

  const heroRow = heroOnBottom ? 5 : 1
  const firstConnectorRow = heroOnBottom ? 2 : 2
  const firstPairRow = heroOnBottom ? 1 : 3
  const secondConnectorRow = heroOnBottom ? 4 : 4
  const secondPairRow = heroOnBottom ? 3 : 5

  return (
    <div
      data-slot="stacked-block-layout"
      data-layout="two-column"
      data-hero-position={heroPosition}
      className={cn("grid w-full min-w-0", className)}
      style={{
        backgroundColor,
        gridTemplateColumns: TWO_COLUMN_TEMPLATE,
        gridTemplateRows,
      }}
    >
      <div
        data-slot="stacked-block-layout-hero"
        className={cn(
          "col-span-full min-h-0 overflow-hidden p-5 md:p-6",
          heroMaxHeight !== "auto" && "max-h-[390px]",
          heroClassName
        )}
        style={{ ...blockStyle, gridRow: heroRow, borderRadius: BLOCK_RADIUS }}
      >
        {hero}
      </div>

      <ConnectorGapCell gridRow={firstConnectorRow} blockColor={blockColor} />
      <GutterCrossCell gridRow={firstConnectorRow} />
      <ConnectorGapCell
        gridRow={firstConnectorRow}
        gridColumn={3}
        blockColor={blockColor}
      />

      <StackedBlockCell
        gridRow={firstPairRow}
        className={blockClassName}
        style={blockStyle}
      >
        {row1Left}
      </StackedBlockCell>
      <GutterCrossCell gridRow={firstPairRow} />
      <StackedBlockCell
        gridRow={firstPairRow}
        gridColumn={3}
        className={blockClassName}
        style={blockStyle}
      >
        {row1Right}
      </StackedBlockCell>

      <ConnectorGapCell gridRow={secondConnectorRow} blockColor={blockColor} />
      <GutterCrossCell gridRow={secondConnectorRow} />
      <ConnectorGapCell
        gridRow={secondConnectorRow}
        gridColumn={3}
        blockColor={blockColor}
      />

      <StackedBlockCell
        gridRow={secondPairRow}
        className={blockClassName}
        style={blockStyle}
      >
        {row2Left}
      </StackedBlockCell>
      <GutterCrossCell gridRow={secondPairRow} />
      {row2Right ? (
        <StackedBlockCell
          gridRow={secondPairRow}
          gridColumn={3}
          className={blockClassName}
          style={blockStyle}
        >
          {row2Right}
        </StackedBlockCell>
      ) : (
        <GutterCrossCell gridRow={secondPairRow} gridColumn={3} />
      )}
    </div>
  )
}

type GridPositionProps = {
  gridRow: number
  gridColumn?: number | string
}

function GutterCrossCell({ gridRow, gridColumn = 2 }: GridPositionProps) {
  return (
    <div
      aria-hidden
      className="min-h-0 min-w-0"
      style={{ gridRow, gridColumn }}
    />
  )
}

function ConnectorGapCell({
  gridRow,
  gridColumn = 1,
  blockColor,
}: GridPositionProps & { blockColor: string }) {
  return (
    <div
      className="relative z-[1] flex min-h-0 min-w-0 items-stretch justify-center"
      style={{
        gridRow,
        gridColumn,
        height: GUTTER_SIZE,
      }}
    >
      <div
        className="h-full"
        style={{ width: `${CONNECTOR_WIDTH_RATIO * 100}%` }}
      >
        <ConnectorBar fill={blockColor} />
      </div>
    </div>
  )
}

function StackedBlockCell({
  gridRow,
  gridColumn = 1,
  className,
  style,
  children,
}: GridPositionProps &
  Pick<React.ComponentProps<"div">, "className" | "style" | "children">) {
  return (
    <div
      data-slot="stacked-block-layout-block"
      className={cn("min-h-0 min-w-0 overflow-hidden p-5", className)}
      style={{ borderRadius: BLOCK_RADIUS, ...style, gridRow, gridColumn }}
    >
      {children}
    </div>
  )
}

export {
  CONNECTOR_BAR_PATH,
  ConnectorBar,
  StackedBlockLayout,
  DEFAULT_BLOCK_COLOR,
  GUTTER_SIZE,
  BLOCK_RADIUS,
  HERO_MAX_HEIGHT,
  ROW_HEIGHT,
}
