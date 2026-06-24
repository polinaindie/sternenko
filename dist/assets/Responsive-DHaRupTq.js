import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{I as n,a as r,o as i}from"./blocks-CJ05s_Nf.js";import{t as a}from"./mdx-react-shim-G1iwXuHu.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r,{title:`Responsive`}),`
`,(0,c.jsx)(t.h1,{id:`responsive-rules`,children:`Responsive rules`}),`
`,(0,c.jsxs)(t.p,{children:[`The skeleton is `,(0,c.jsx)(t.strong,{children:`mobile-first`}),`. Components own their adaptive behavior; pages
compose them with a small set of layout primitives and a single breakpoint
contract. Brand themes never change layout — only color, radius, font and shadow.`]}),`
`,(0,c.jsx)(t.h2,{id:`breakpoints`,children:`Breakpoints`}),`
`,(0,c.jsxs)(t.p,{children:[`One source of truth lives in `,(0,c.jsx)(t.code,{children:`packages/tokens/themes/base.css`}),` and is wired into
Tailwind via `,(0,c.jsx)(t.code,{children:`globals.css`}),` `,(0,c.jsx)(t.code,{children:`@theme`}),`. JavaScript reads the same `,(0,c.jsx)(t.code,{children:`--breakpoint-md`}),`
token via `,(0,c.jsx)(t.code,{children:`useIsMobile`}),`, so CSS and JS never drift.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Token`}),(0,c.jsx)(t.th,{children:`Value`}),(0,c.jsx)(t.th,{children:`Tailwind`}),(0,c.jsx)(t.th,{children:`Use for`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-xs`})}),(0,c.jsx)(t.td,{children:`480px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`xs:`})}),(0,c.jsx)(t.td,{children:`large phones (iPhone Pro Max, Galaxy Ultra)`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-sm`})}),(0,c.jsx)(t.td,{children:`640px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`sm:`})}),(0,c.jsx)(t.td,{children:`small tablets portrait, phones in landscape`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-md`})}),(0,c.jsx)(t.td,{children:`768px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`md:`})}),(0,c.jsx)(t.td,{children:`iPad Mini/Air portrait, 1 → 2 column grids`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-lg`})}),(0,c.jsx)(t.td,{children:`1024px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`lg:`})}),(0,c.jsx)(t.td,{children:`iPad Pro, laptops, split layouts`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-xl`})}),(0,c.jsx)(t.td,{children:`1280px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`xl:`})}),(0,c.jsx)(t.td,{children:`standard desktop (most common 1366–1536px)`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-2xl`})}),(0,c.jsx)(t.td,{children:`1536px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`2xl:`})}),(0,c.jsx)(t.td,{children:`wide monitors, max-width containers`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`--breakpoint-3xl`})}),(0,c.jsx)(t.td,{children:`1920px`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`3xl:`})}),(0,c.jsx)(t.td,{children:`Full HD — loose spacing and typography on large screens`})]})]})]}),`
`,(0,c.jsx)(t.h3,{id:`what-changed-2026`,children:`What changed (2026)`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsxs)(t.strong,{children:[(0,c.jsx)(t.code,{children:`xs`}),` (480px)`]}),` — modern flagships are already 430–480px wide (iPhone 16 Pro
Max = 430pt). Without `,(0,c.jsx)(t.code,{children:`xs`}),`, there is a large gap between the mobile base and
`,(0,c.jsx)(t.code,{children:`sm`}),` where nothing happens.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsxs)(t.strong,{children:[(0,c.jsx)(t.code,{children:`2xl`}),` (1536px)`]}),` — the most popular desktop range today (1366–1536px), so a
dedicated token is required, not optional.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsxs)(t.strong,{children:[(0,c.jsx)(t.code,{children:`3xl`}),` (1920px)`]}),` — Full HD remains the standard for large monitors; here
you mainly control max-width containers and loose spacing, not radical layout
shifts.`]}),`
`]}),`
`,(0,c.jsx)(t.h3,{id:`viewport-vs-container-queries`,children:`Viewport vs container queries`}),`
`,(0,c.jsxs)(t.p,{children:[`With widespread `,(0,c.jsx)(t.code,{children:`@container`}),` support, `,(0,c.jsx)(t.strong,{children:`viewport breakpoints are for page-level
layout`}),` — column counts, shell padding, split views. `,(0,c.jsx)(t.strong,{children:`Component behavior`}),`
(cards, forms, navigation) should prefer container queries so the component
adapts to its parent, not the window width.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`// Page-level — viewport breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />

// Component-level — container queries (already used in Card, Field, …)
<div className="@container/card">
  <div className="flex flex-col @sm/card:flex-row" />
</div>
`})}),`
`,(0,c.jsx)(t.h2,{id:`mobile-first-principle`,children:`Mobile-first principle`}),`
`,(0,c.jsxs)(t.p,{children:[`Write the base (smallest) layout with `,(0,c.jsx)(t.strong,{children:`no prefix`}),`, then escalate up with
`,(0,c.jsx)(t.code,{children:`xs:`}),` / `,(0,c.jsx)(t.code,{children:`sm:`}),` / `,(0,c.jsx)(t.code,{children:`md:`}),` / `,(0,c.jsx)(t.code,{children:`lg:`}),` / `,(0,c.jsx)(t.code,{children:`xl:`}),` / `,(0,c.jsx)(t.code,{children:`2xl:`}),` / `,(0,c.jsx)(t.code,{children:`3xl:`}),`. Never start from
desktop and shrink down.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`// Good — base is mobile, escalate upward
<div className="flex flex-col gap-4 md:flex-row md:items-center" />

// Avoid — desktop-first, fights the cascade
<div className="flex flex-row md:flex-col" />
`})}),`
`,(0,c.jsx)(t.h2,{id:`layout-primitives`,children:`Layout primitives`}),`
`,(0,c.jsxs)(t.p,{children:[`Gutters are three-step: `,(0,c.jsx)(t.code,{children:`--page-gutter`}),` (mobile) → `,(0,c.jsx)(t.code,{children:`--page-gutter-md`}),` (`,(0,c.jsx)(t.code,{children:`md:`}),`) →
`,(0,c.jsx)(t.code,{children:`--page-gutter-lg`}),` (`,(0,c.jsx)(t.code,{children:`lg:`}),`). Default brands keep `,(0,c.jsx)(t.code,{children:`lg`}),` equal to `,(0,c.jsx)(t.code,{children:`md`}),`.`]}),`
`,(0,c.jsxs)(t.p,{children:[`Use these from `,(0,c.jsx)(t.code,{children:`@workspace/ui/layout/*`}),` instead of repeating shell/padding
classes on every page.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Primitive`}),(0,c.jsx)(t.th,{children:`Import`}),(0,c.jsx)(t.th,{children:`Role`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`PageShell`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@workspace/ui/layout/page-shell`})}),(0,c.jsxs)(t.td,{children:[`Full-height themed canvas (`,(0,c.jsx)(t.code,{children:`min-h-svh`}),`, background tokens).`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Container`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@workspace/ui/layout/container`})}),(0,c.jsxs)(t.td,{children:[`Centers content, caps at `,(0,c.jsx)(t.code,{children:`--container-max`}),`, applies gutters (`,(0,c.jsx)(t.code,{children:`--page-gutter`}),` → `,(0,c.jsx)(t.code,{children:`md`}),` → `,(0,c.jsx)(t.code,{children:`lg`}),`).`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`ContentContainer`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@workspace/ui/layout/content-container`})}),(0,c.jsxs)(t.td,{children:[`Inner reading column (`,(0,c.jsx)(t.code,{children:`--container-content-max`}),`, optional `,(0,c.jsx)(t.code,{children:`--content-inner-padding`}),`).`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`SplitSection`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@workspace/ui/layout/split-section`})}),(0,c.jsxs)(t.td,{children:[`Programme aside + body columns (`,(0,c.jsx)(t.code,{children:`--content-aside-width`}),`, `,(0,c.jsx)(t.code,{children:`--content-column-gap`}),`).`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Stack`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@workspace/ui/layout/stack`})}),(0,c.jsx)(t.td,{children:`Vertical flow with a consistent gap.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Grid`})}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`@workspace/ui/layout/grid`})}),(0,c.jsxs)(t.td,{children:[`One column by default; escalate with `,(0,c.jsx)(t.code,{children:`md:grid-cols-*`}),`.`]})]})]})]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { PageShell } from "@workspace/ui/layout/page-shell"
import { Container } from "@workspace/ui/layout/container"
import { Stack } from "@workspace/ui/layout/stack"

export function Page() {
  return (
    <PageShell>
      <Container>
        <Stack>{/* page sections */}</Stack>
      </Container>
    </PageShell>
  )
}
`})}),`
`,(0,c.jsx)(t.h2,{id:`who-owns-what`,children:`Who owns what`}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Concern`}),(0,c.jsx)(t.th,{children:`Lives in`}),(0,c.jsx)(t.th,{children:`Example`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Adaptive component behavior`}),(0,c.jsxs)(t.td,{children:[`Skeleton (`,(0,c.jsx)(t.code,{children:`ui`}),`)`]}),(0,c.jsx)(t.td,{children:`Sidebar collapses to a Sheet on mobile.`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Hiding secondary UI on small`}),(0,c.jsxs)(t.td,{children:[`Skeleton (`,(0,c.jsx)(t.code,{children:`ui`}),`)`]}),(0,c.jsxs)(t.td,{children:[`Pagination labels `,(0,c.jsx)(t.code,{children:`hidden sm:block`}),`.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Page composition & column counts`}),(0,c.jsx)(t.td,{children:`App pages / blocks`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`grid-cols-1 md:grid-cols-3`}),`.`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Color, radius, font, shadow`}),(0,c.jsxs)(t.td,{children:[`Theme (`,(0,c.jsx)(t.code,{children:`tokens`}),`)`]}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`[data-theme="acme"]`}),` overrides.`]})]})]})]}),`
`,(0,c.jsx)(t.h2,{id:`page-patterns`,children:`Page patterns`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Stack to row:`}),` `,(0,c.jsx)(t.code,{children:`flex flex-col`}),` → `,(0,c.jsx)(t.code,{children:`sm:flex-row`}),` for toolbars and headers.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Grids:`}),` start `,(0,c.jsx)(t.code,{children:`grid-cols-1`}),`, escalate `,(0,c.jsx)(t.code,{children:`md:grid-cols-2`}),` / `,(0,c.jsx)(t.code,{children:`lg:grid-cols-3`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Page padding:`}),` prefer `,(0,c.jsx)(t.code,{children:`Container`}),` gutters; for full-bleed blocks use
`,(0,c.jsx)(t.code,{children:`p-6 md:p-10`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Split layouts:`}),` hide the decorative half on mobile —
`,(0,c.jsx)(t.code,{children:`hidden lg:flex`}),` with `,(0,c.jsx)(t.code,{children:`lg:grid-cols-2`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Fullscreen blocks:`}),` set `,(0,c.jsx)(t.code,{children:`parameters: { layout: "fullscreen" }`}),` in the story
so the canvas matches the real viewport.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`do-not`,children:`Do not`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Build separate `,(0,c.jsx)(t.code,{children:`MobileButton`}),` / `,(0,c.jsx)(t.code,{children:`DesktopButton`}),` components — one component,
responsive classes.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Hardcode pixel paddings on pages instead of `,(0,c.jsx)(t.code,{children:`Container`}),` gutters.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Introduce custom breakpoints without adding a token to `,(0,c.jsx)(t.code,{children:`base.css`}),`.`]}),`
`,(0,c.jsx)(t.li,{children:`Put layout differences inside a brand theme — themes are visual only.`}),`
`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),i()}))();export{s as default};