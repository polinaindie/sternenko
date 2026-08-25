import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{n,t as r}from"./report-card-C207aCV1.js";import{a as i,i as a,n as o,r as s,t as c}from"./metric-bar-DWGL1PlF.js";var l,u,d,f,p,m,h;e((()=>{i(),n(),l=t(),u={title:`Report/Metric Bar`,component:c,tags:[`autodocs`]},d={args:{percent:47,label:`< 100`,className:`w-20`}},f={args:{percent:0},render:()=>(0,l.jsx)(`div`,{"data-report-palette":`donations`,className:`bg-foreground w-full max-w-xl p-4`,children:(0,l.jsx)(r,{tone:`accent`,children:(0,l.jsxs)(o,{children:[(0,l.jsx)(c,{percent:47,label:`< 100`}),(0,l.jsx)(c,{percent:40,label:`100 - 500`}),(0,l.jsx)(c,{percent:7,label:`500 - 1000`}),(0,l.jsx)(c,{percent:5,label:`1000 - 5000`}),(0,l.jsx)(c,{percent:1,label:`5000 <`})]})})})},p={args:{percent:0},render:()=>(0,l.jsx)(r,{tone:`muted`,className:`w-full max-w-xl`,children:(0,l.jsxs)(o,{children:[(0,l.jsx)(c,{percent:51,valueLabel:`2 749`,label:`звичайних`}),(0,l.jsx)(c,{percent:14,valueLabel:`770`,label:`зенітних`}),(0,l.jsx)(c,{percent:9,valueLabel:`501`,label:`перехоплювачі`}),(0,l.jsx)(c,{percent:13,valueLabel:`690`,label:`оптоволокно`}),(0,l.jsx)(c,{percent:12,valueLabel:`637`,label:`інших`})]})})},m={args:{percent:0},render:()=>(0,l.jsx)(`div`,{"data-report-palette":`potochnyi`,className:`bg-foreground text-background w-full max-w-3xl p-4`,children:(0,l.jsxs)(a,{variant:`solid`,className:`gap-3`,children:[(0,l.jsx)(s,{percent:46,valueLabel:`36`,valueCaption:`запитів`,label:`Поточний`,fillColor:`#829474`,trackClassName:`bg-foreground/10`}),(0,l.jsx)(s,{percent:21,valueLabel:`16`,valueCaption:`запитів`,label:`Небесний`,fillColor:`#59CBE7`,trackClassName:`bg-foreground/10`}),(0,l.jsx)(s,{percent:17,valueLabel:`13`,valueCaption:`запитів`,label:`Секретний`,fillColor:`#FE6A34`,trackClassName:`bg-foreground/10`}),(0,l.jsx)(s,{percent:8,valueLabel:`6`,valueCaption:`запитів`,label:`РеДрон`,fillColor:`#DCDCDC`,trackClassName:`bg-foreground/10`}),(0,l.jsx)(s,{percent:8,valueLabel:`6`,valueCaption:`запитів`,label:`Шахедоріз`,fillColor:`#FFD62E`,trackClassName:`bg-foreground/10`})]})})},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    percent: 47,
    label: "< 100",
    className: "w-20"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    percent: 0
  },
  render: () => <div data-report-palette="donations" className="bg-foreground w-full max-w-xl p-4">
      <ReportCard tone="accent">
        <MetricBarGroup>
          <MetricBar percent={47} label="< 100" />
          <MetricBar percent={40} label="100 - 500" />
          <MetricBar percent={7} label="500 - 1000" />
          <MetricBar percent={5} label="1000 - 5000" />
          <MetricBar percent={1} label="5000 <" />
        </MetricBarGroup>
      </ReportCard>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    percent: 0
  },
  render: () => <ReportCard tone="muted" className="w-full max-w-xl">
      <MetricBarGroup>
        <MetricBar percent={51} valueLabel="2 749" label="звичайних" />
        <MetricBar percent={14} valueLabel="770" label="зенітних" />
        <MetricBar percent={9} valueLabel="501" label="перехоплювачі" />
        <MetricBar percent={13} valueLabel="690" label="оптоволокно" />
        <MetricBar percent={12} valueLabel="637" label="інших" />
      </MetricBarGroup>
    </ReportCard>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    percent: 0
  },
  render: () => <div data-report-palette="potochnyi" className="bg-foreground text-background w-full max-w-3xl p-4">
      <MetricBarList variant="solid" className="gap-3">
        <MetricBarHorizontal percent={46} valueLabel="36" valueCaption="запитів" label="Поточний" fillColor="#829474" trackClassName="bg-foreground/10" />
        <MetricBarHorizontal percent={21} valueLabel="16" valueCaption="запитів" label="Небесний" fillColor="#59CBE7" trackClassName="bg-foreground/10" />
        <MetricBarHorizontal percent={17} valueLabel="13" valueCaption="запитів" label="Секретний" fillColor="#FE6A34" trackClassName="bg-foreground/10" />
        <MetricBarHorizontal percent={8} valueLabel="6" valueCaption="запитів" label="РеДрон" fillColor="#DCDCDC" trackClassName="bg-foreground/10" />
        <MetricBarHorizontal percent={8} valueLabel="6" valueCaption="запитів" label="Шахедоріз" fillColor="#FFD62E" trackClassName="bg-foreground/10" />
      </MetricBarList>
    </div>
}`,...m.parameters?.docs?.source}}},h=[`Single`,`Breakdown`,`WithValues`,`SolidBreakdown`]}))();export{f as Breakdown,d as Single,m as SolidBreakdown,p as WithValues,h as __namedExportsOrder,u as default};