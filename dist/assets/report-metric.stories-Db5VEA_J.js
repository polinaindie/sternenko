import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{i as n,n as r,t as i}from"./report-metric-brauwEAD.js";import{n as a,t as o}from"./report-card-C207aCV1.js";var s,c,l,u,d,f,p;e((()=>{n(),a(),s=t(),c={title:`Report/Metric`,component:r,tags:[`autodocs`],argTypes:{size:{control:`inline-radio`,options:[`sm`,`default`,`lg`]},align:{control:`inline-radio`,options:[`start`,`end`]}}},l={args:{value:371,label:`БПЛА збито за місяць`,size:`lg`}},u={args:{value:225366619,label:`Сума надходжень, ₴`,size:`default`}},d={args:{value:0},render:()=>(0,s.jsx)(o,{className:`w-80`,size:`lg`,children:(0,s.jsx)(r,{value:2861,label:`БПЛА збито за весь час`,size:`lg`})})},f={args:{value:0},render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-end gap-10`,children:[(0,s.jsx)(i,{amount:72e5,currency:`$`,compact:!0,size:`lg`,label:`збитки окупантів`}),(0,s.jsx)(i,{amount:210572345,currency:`₴`,label:`на суму`})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    value: 371,
    label: "БПЛА збито за місяць",
    size: "lg"
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    value: 225366619,
    label: "Сума надходжень, ₴",
    size: "default"
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0
  },
  render: () => <ReportCard className="w-80" size="lg">
      <DisplayMetric value={2861} label="БПЛА збито за весь час" size="lg" />
    </ReportCard>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0
  },
  render: () => <div className="flex flex-wrap items-end gap-10">
      <CurrencyMetric amount={7200000} currency="$" compact size="lg" label="збитки окупантів" />
      <CurrencyMetric amount={210572345} currency="₴" label="на суму" />
    </div>
}`,...f.parameters?.docs?.source}}},p=[`Default`,`Grouping`,`OnAccentCard`,`Currency`]}))();export{f as Currency,l as Default,u as Grouping,d as OnAccentCard,p as __namedExportsOrder,c as default};