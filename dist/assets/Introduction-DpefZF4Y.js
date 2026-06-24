import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{I as n,a as r,o as i}from"./blocks-CJ05s_Nf.js";import{t as a}from"./mdx-react-shim-G1iwXuHu.js";function o(e){let t={a:`a`,code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r,{title:`Introduction`}),`
`,(0,c.jsx)(t.h1,{id:`design-system`,children:`Design System`}),`
`,(0,c.jsxs)(t.p,{children:[`A reusable component library based on `,(0,c.jsx)(t.strong,{children:`shadcn/ui`}),`, aligned with the
`,(0,c.jsx)(t.a,{href:`https://www.figma.com/design/QbrZMpnpDjla1QhoU5tTQL`,rel:`nofollow`,children:`Figma shadcn kit`}),`. The same
components are re-skinned per brand by swapping CSS variables — no fork required.`]}),`
`,(0,c.jsx)(t.h2,{id:`theming`,children:`Theming`}),`
`,(0,c.jsx)(t.p,{children:`Use the toolbar at the top of the canvas to switch:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Brand`}),` — `,(0,c.jsx)(t.code,{children:`Default`}),`, `,(0,c.jsx)(t.code,{children:`Acme`}),`, `,(0,c.jsx)(t.code,{children:`Sharp`}),`, `,(0,c.jsx)(t.code,{children:`Спільнота Стерненка`}),` (sets `,(0,c.jsx)(t.code,{children:`data-theme`}),` on `,(0,c.jsx)(t.code,{children:`<html>`}),`)`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Appearance`}),` — `,(0,c.jsx)(t.code,{children:`Light`}),` / `,(0,c.jsx)(t.code,{children:`Dark`}),` (toggles the `,(0,c.jsx)(t.code,{children:`.dark`}),` class)`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Components never hardcode colors; they read tokens like `,(0,c.jsx)(t.code,{children:`--primary`}),`, `,(0,c.jsx)(t.code,{children:`--border`}),`,
`,(0,c.jsx)(t.code,{children:`--radius`}),`, `,(0,c.jsx)(t.code,{children:`--font-sans`}),`. A brand is just a CSS file overriding those variables
under `,(0,c.jsx)(t.code,{children:`[data-theme="..."]`}),`.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Theme`}),(0,c.jsx)(t.th,{children:`Primary`}),(0,c.jsx)(t.th,{children:`Radius`}),(0,c.jsx)(t.th,{children:`Font`}),(0,c.jsx)(t.th,{children:`Shadow`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Default`}),(0,c.jsx)(t.td,{children:`neutral`}),(0,c.jsx)(t.td,{children:`0.625rem`}),(0,c.jsx)(t.td,{children:`Inter`}),(0,c.jsx)(t.td,{children:`soft`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Acme`}),(0,c.jsx)(t.td,{children:`red`}),(0,c.jsx)(t.td,{children:`1rem`}),(0,c.jsx)(t.td,{children:`Geist`}),(0,c.jsx)(t.td,{children:`soft, tinted`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Sharp`}),(0,c.jsx)(t.td,{children:`blue`}),(0,c.jsx)(t.td,{children:`0.25rem`}),(0,c.jsx)(t.td,{children:`IBM Plex / system`}),(0,c.jsx)(t.td,{children:`flat`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Спільнота Стерненка`}),(0,c.jsxs)(t.td,{children:[`yellow `,(0,c.jsx)(t.code,{children:`#FFD62E`})]}),(0,c.jsx)(t.td,{children:`0 (sharp)`}),(0,c.jsx)(t.td,{children:`Murs Gothic`}),(0,c.jsx)(t.td,{children:`flat`})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`The `,(0,c.jsx)(t.strong,{children:`Спільнота Стерненка`}),` theme follows the SSF brandbook — yellow energy accent,
black text, Murs Gothic type scale (Wide / Narrow / Key cuts).`]}),`
`,(0,c.jsx)(t.h2,{id:`component-coverage`,children:`Component coverage`}),`
`,(0,c.jsxs)(t.p,{children:[`Phased rollout toward ~80% of the practical kit. Full mapping in
`,(0,c.jsx)(t.code,{children:`docs/figma-inventory.md`}),`.`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Wave`}),(0,c.jsx)(t.th,{children:`Components`}),(0,c.jsx)(t.th,{children:`Status`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`P0 — foundation`}),(0,c.jsx)(t.td,{children:`button, input, label, checkbox, accordion, badge, avatar, card, dialog, tabs, tooltip, select, dropdown-menu, separator`}),(0,c.jsx)(t.td,{children:`done`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`P1 — next wave`}),(0,c.jsx)(t.td,{children:`radio-group, switch, textarea, popover, sonner, sheet, breadcrumb`}),(0,c.jsx)(t.td,{children:`done`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`P2 — high value`}),(0,c.jsx)(t.td,{children:`table, pagination, field (forms), calendar, command, sidebar, alert, alert-dialog`}),(0,c.jsx)(t.td,{children:`done`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`P3 — rounding`}),(0,c.jsx)(t.td,{children:`progress, slider, toggle, toggle-group, collapsible, scroll-area, hover-card, aspect-ratio, input-otp`}),(0,c.jsx)(t.td,{children:`done`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Extended`}),(0,c.jsx)(t.td,{children:`carousel, chart, context-menu, drawer, menubar, navigation-menu, and the example Blocks`}),(0,c.jsx)(t.td,{children:`done`})]})]})]}),`
`,(0,c.jsx)(t.p,{children:`50+ component files plus composed Blocks, all exercised under the brand +
appearance toolbars.`}),`
`,(0,c.jsx)(t.h2,{id:`building-a-site`,children:`Building a site`}),`
`,(0,c.jsx)(t.p,{children:`The skeleton is meant to be reused across client projects. Two guides cover the
workflow:`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Responsive`}),` — the mobile-first rules, breakpoint tokens and layout
primitives (`,(0,c.jsx)(t.code,{children:`PageShell`}),`, `,(0,c.jsx)(t.code,{children:`Container`}),`, `,(0,c.jsx)(t.code,{children:`Stack`}),`, `,(0,c.jsx)(t.code,{children:`Grid`}),`).`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.code,{children:`docs/new-client-checklist.md`}),` — turn a brandbook into one theme file plus one
app with `,(0,c.jsx)(t.code,{children:`pnpm create-theme`}),`, then compose pages from the kit.`]}),`
`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),i()}))();export{s as default};