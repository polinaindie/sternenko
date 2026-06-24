import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{i as n,n as r}from"./report-metric-brauwEAD.js";import{n as i,t as a}from"./report-card-C207aCV1.js";var o,s,c,l,u,d,f,p,m,h;e((()=>{n(),i(),o=t(),s={title:`Foundations/Overview`,parameters:{layout:`fullscreen`}},c=[{name:`Background`,token:`--background`,fg:`--foreground`},{name:`Foreground`,token:`--foreground`,fg:`--background`},{name:`Primary`,token:`--primary`,fg:`--primary-foreground`},{name:`Muted`,token:`--muted`,fg:`--muted-foreground`},{name:`Card`,token:`--card`,fg:`--card-foreground`},{name:`Destructive`,token:`--destructive`,fg:`--background`}],l={render:()=>(0,o.jsxs)(`div`,{className:`bg-background text-foreground min-h-svh p-8`,children:[(0,o.jsx)(`h2`,{className:`font-heading mb-6 text-2xl`,children:`Палітра`}),(0,o.jsx)(`div`,{className:`grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6`,children:c.map(e=>(0,o.jsxs)(`div`,{className:`flex aspect-square flex-col justify-between rounded-[var(--radius-report)] border border-border p-3 text-xs`,style:{backgroundColor:`var(${e.token})`,color:`var(${e.fg})`},children:[(0,o.jsx)(`span`,{className:`font-medium`,children:e.name}),(0,o.jsx)(`code`,{children:e.token})]},e.token))})]})},u=[{font:`--font-display-black`,role:`h1 — Wide Black`,sample:`$42 МЛН`},{font:`--font-display-dark`,role:`h2 — Wide Dark`,sample:`ШАХЕДОРІЗ`},{font:`--font-subheading-dark`,role:`h3–h4 — Narrow Dark`,sample:`Розподіл по сумі донатів`},{font:`--font-sans`,role:`body — Key Regular`,sample:`приблизні збитки окупантів за місяць`}],d={render:()=>(0,o.jsxs)(`div`,{className:`bg-background text-foreground min-h-svh space-y-8 p-8`,children:[(0,o.jsx)(`h2`,{className:`font-heading text-2xl`,children:`Шрифтова шкала — Murs Gothic`}),(0,o.jsx)(`div`,{className:`space-y-6`,children:u.map(e=>(0,o.jsxs)(`div`,{className:`border-border border-b pb-4`,children:[(0,o.jsxs)(`p`,{className:`text-muted-foreground mb-1 text-xs uppercase`,children:[e.role,` · `,(0,o.jsx)(`code`,{children:e.font})]}),(0,o.jsx)(`p`,{className:`text-4xl leading-[0.9] tracking-[-0.02em] uppercase md:text-5xl`,style:{fontFamily:`var(${e.font})`},children:e.sample})]},e.font))}),(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`p`,{className:`text-muted-foreground mb-2 text-xs uppercase`,children:`Display-число (uk-UA grouping)`}),(0,o.jsx)(r,{value:225366619,label:`Сума надходжень, ₴`,size:`lg`})]})]})},f=[{id:`shahedoriz`,name:`Шахедоріз / звіт`,note:`жовтий #FFD62E на чорному`},{id:`nebesnyi`,name:`Небесний русоріз`,note:`cyan #59CBE7 на чорному`},{id:`donations`,name:`Звіт по донатах`,note:`помаранчевий #FE6A34 + sage #829474`},{id:`potochnyi`,name:`Поточний русоріз`,note:`олива #829474 на темно-зеленому`},{id:`fpv`,name:`FPV-закупівлі`,note:`khaki #A77E49 + cream #F5E4CA`},{id:`redrone`,name:`ReDRONE`,note:`монохром: чорне / світло-сіре`}],p=[{token:`--background`,label:`background`},{token:`--foreground`,label:`foreground`},{token:`--primary`,label:`primary`},{token:`--accent`,label:`accent`}],m={render:()=>(0,o.jsxs)(`div`,{className:`bg-background text-foreground min-h-svh space-y-6 p-8`,children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`h2`,{className:`font-heading text-2xl`,children:`Палітри проєктів`}),(0,o.jsxs)(`p`,{className:`text-muted-foreground mt-1 text-sm`,children:[`Комбінації, стягнуті зі скріншотів звітів. Накладаються через`,(0,o.jsx)(`code`,{className:`mx-1`,children:`data-report-palette`}),`— перевизначають лише семантичні токени, тож компоненти пере-скінюються без змін.`]})]}),(0,o.jsx)(`div`,{className:`space-y-4`,children:f.map(e=>(0,o.jsxs)(`div`,{"data-report-palette":e.id,className:`border-border grid items-center gap-4 rounded-[var(--radius-report)] border p-[var(--radius-report-inset)] md:grid-cols-[14rem_1fr_auto]`,children:[(0,o.jsxs)(`div`,{children:[(0,o.jsx)(`p`,{className:`font-heading text-base`,children:e.name}),(0,o.jsx)(`p`,{className:`text-muted-foreground text-xs`,children:e.note}),(0,o.jsx)(`code`,{className:`text-muted-foreground text-[0.7rem]`,children:e.id})]}),(0,o.jsx)(`div`,{className:`flex gap-2`,children:p.map(e=>(0,o.jsxs)(`div`,{className:`flex-1 text-center`,children:[(0,o.jsx)(`div`,{className:`border-border h-12 w-full rounded-[var(--radius-report-inner)] border`,style:{backgroundColor:`var(${e.token})`}}),(0,o.jsx)(`span`,{className:`text-muted-foreground mt-1 block text-[0.65rem]`,children:e.label})]},e.token))}),(0,o.jsx)(a,{tone:`accent`,className:`w-44`,children:(0,o.jsx)(r,{value:2861,label:`приклад`,size:`sm`})})]},e.id))})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-background text-foreground min-h-svh p-8">
      <h2 className="font-heading mb-6 text-2xl">Палітра</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {PALETTE.map(swatch => <div key={swatch.token} className="flex aspect-square flex-col justify-between rounded-[var(--radius-report)] border border-border p-3 text-xs" style={{
        backgroundColor: \`var(\${swatch.token})\`,
        color: \`var(\${swatch.fg})\`
      }}>
            <span className="font-medium">{swatch.name}</span>
            <code>{swatch.token}</code>
          </div>)}
      </div>
    </div>
}`,...l.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-background text-foreground min-h-svh space-y-8 p-8">
      <h2 className="font-heading text-2xl">Шрифтова шкала — Murs Gothic</h2>
      <div className="space-y-6">
        {TYPE_RAMP.map(row => <div key={row.font} className="border-border border-b pb-4">
            <p className="text-muted-foreground mb-1 text-xs uppercase">
              {row.role} · <code>{row.font}</code>
            </p>
            <p className="text-4xl leading-[0.9] tracking-[-0.02em] uppercase md:text-5xl" style={{
          fontFamily: \`var(\${row.font})\`
        }}>
              {row.sample}
            </p>
          </div>)}
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-xs uppercase">
          Display-число (uk-UA grouping)
        </p>
        <DisplayMetric value={225366619} label="Сума надходжень, ₴" size="lg" />
      </div>
    </div>
}`,...d.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="bg-background text-foreground min-h-svh space-y-6 p-8">
      <div>
        <h2 className="font-heading text-2xl">Палітри проєктів</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Комбінації, стягнуті зі скріншотів звітів. Накладаються через
          <code className="mx-1">data-report-palette</code>— перевизначають лише
          семантичні токени, тож компоненти пере-скінюються без змін.
        </p>
      </div>

      <div className="space-y-4">
        {PROJECT_PALETTES.map(palette => <div key={palette.id} data-report-palette={palette.id} className="border-border grid items-center gap-4 rounded-[var(--radius-report)] border p-[var(--radius-report-inset)] md:grid-cols-[14rem_1fr_auto]">
            <div>
              <p className="font-heading text-base">{palette.name}</p>
              <p className="text-muted-foreground text-xs">{palette.note}</p>
              <code className="text-muted-foreground text-[0.7rem]">
                {palette.id}
              </code>
            </div>

            <div className="flex gap-2">
              {SWATCHES.map(swatch => <div key={swatch.token} className="flex-1 text-center">
                  <div className="border-border h-12 w-full rounded-[var(--radius-report-inner)] border" style={{
              backgroundColor: \`var(\${swatch.token})\`
            }} />
                  <span className="text-muted-foreground mt-1 block text-[0.65rem]">
                    {swatch.label}
                  </span>
                </div>)}
            </div>

            <ReportCard tone="accent" className="w-44">
              <DisplayMetric value={2861} label="приклад" size="sm" />
            </ReportCard>
          </div>)}
      </div>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Colors`,`Typography`,`ProjectPalettes`]}))();export{l as Colors,m as ProjectPalettes,d as Typography,h as __namedExportsOrder,s as default};