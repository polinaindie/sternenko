import{i as e}from"./preload-helper-xPQekRTU.js";import{t,w as n}from"./iframe-DquaFbOf.js";import{n as r,t as i}from"./utils-D8qMR3V9.js";import{i as a,n as o,t as s}from"./report-metric-brauwEAD.js";import{n as c,t as l}from"./project-title-VvXmI62F.js";import{n as u,t as d}from"./report-card-C207aCV1.js";import{n as f,t as p}from"./report-date-stamp-D7jK60y-.js";function m({className:e,period:t,dateStampLabel:n,project:r,projectIcon:a,hero:c,secondary:u=[],media:f,loss:m,palette:g,..._}){return(0,h.jsx)(`section`,{"data-slot":`monthly-report-block`,"data-report-palette":g,className:i(`bg-foreground text-background w-full p-3 md:p-4`,e),..._,children:(0,h.jsxs)(`div`,{className:`grid gap-3 md:grid-cols-2`,children:[(0,h.jsxs)(d,{tone:`accent`,size:`lg`,className:`justify-between gap-8`,children:[(0,h.jsxs)(`div`,{className:`flex flex-col gap-5`,children:[(0,h.jsx)(p,{period:t,label:n}),(0,h.jsx)(l,{icon:a,children:r})]}),(0,h.jsx)(o,{value:c.value,label:c.label,size:`lg`,align:`end`}),u.length?(0,h.jsx)(`div`,{className:`grid grid-cols-2 gap-px overflow-hidden border-t-2 border-current pt-5`,children:u.map((e,t)=>(0,h.jsx)(o,{value:e.value,label:e.label,size:`sm`},t))}):null]}),(0,h.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,h.jsx)(d,{tone:`muted`,size:`lg`,className:`flex-1 items-center justify-center overflow-hidden p-0`,children:f??(0,h.jsx)(`div`,{className:`text-muted-foreground flex aspect-video w-full items-center justify-center text-xs uppercase`,children:`media`})}),m?(0,h.jsx)(s,{amount:m.amount,currency:m.currency,compact:!0,size:`lg`,align:`end`,label:m.label??`приблизні збитки окупантів за місяць`}):null]})]})})}var h,g=e((()=>{n(),a(),c(),u(),f(),r(),h=t(),m.__docgenInfo={description:``,methods:[],displayName:`MonthlyReportBlock`,props:{period:{required:!0,tsType:{name:`string`},description:``},dateStampLabel:{required:!1,tsType:{name:`string`},description:``},project:{required:!0,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},projectIcon:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},hero:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  value: number | string
  label: React.ReactNode
}`,signature:{properties:[{key:`value`,value:{name:`union`,raw:`number | string`,elements:[{name:`number`},{name:`string`}],required:!0}},{key:`label`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}}]}},description:``},secondary:{required:!1,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  value: number | string
  label: React.ReactNode
}`,signature:{properties:[{key:`value`,value:{name:`union`,raw:`number | string`,elements:[{name:`number`},{name:`string`}],required:!0}},{key:`label`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}}]}}],raw:`SecondaryMetric[]`},description:``,defaultValue:{value:`[]`,computed:!1}},media:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``},loss:{required:!1,tsType:{name:`signature`,type:`object`,raw:`{ amount: number; currency?: "₴" | "$"; label?: React.ReactNode }`,signature:{properties:[{key:`amount`,value:{name:`number`,required:!0}},{key:`currency`,value:{name:`union`,raw:`"₴" | "$"`,elements:[{name:`literal`,value:`"₴"`},{name:`literal`,value:`"$"`}],required:!1}},{key:`label`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!1}}]}},description:``},palette:{required:!1,tsType:{name:`union`,raw:`| "shahedoriz"
| "nebesnyi"
| "donations"
| "potochnyi"
| "fpv"
| "redrone"`,elements:[{name:`literal`,value:`"shahedoriz"`},{name:`literal`,value:`"nebesnyi"`},{name:`literal`,value:`"donations"`},{name:`literal`,value:`"potochnyi"`},{name:`literal`,value:`"fpv"`},{name:`literal`,value:`"redrone"`}]},description:``}}}})),_,v,y,b,x;e((()=>{g(),_={title:`Blocks/Monthly Report`,component:m,parameters:{layout:`fullscreen`}},v={args:{period:`Травень 2026`,project:`Шахедоріз`,hero:{value:371,label:`БПЛА збито за місяць`},secondary:[{value:22,label:`запити закрили за місяць`},{value:2861,label:`БПЛА збито за весь час`}],loss:{amount:72e5,currency:`$`}}},y={args:{period:`Травень 2026`,project:`Небесний русоріз`,palette:`nebesnyi`,hero:{value:694,label:`БПЛА збито за місяць`},secondary:[{value:48,label:`запитів закрили за місяць`},{value:11353,label:`БПЛА збито за весь час`}],loss:{amount:134e5,currency:`$`}}},b={args:{period:`Травень 2026`,project:`Поточний русоріз`,palette:`potochnyi`,hero:{value:2319,label:`цілей уражено за місяць`},secondary:[{value:50,label:`од. важкої бронетехніки`},{value:709,label:`од. авто / мототехніки`}],loss:{amount:286e5,currency:`$`}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    period: "Травень 2026",
    project: "Шахедоріз",
    hero: {
      value: 371,
      label: "БПЛА збито за місяць"
    },
    secondary: [{
      value: 22,
      label: "запити закрили за місяць"
    }, {
      value: 2861,
      label: "БПЛА збито за весь час"
    }],
    loss: {
      amount: 7200000,
      currency: "$"
    }
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    period: "Травень 2026",
    project: "Небесний русоріз",
    palette: "nebesnyi",
    hero: {
      value: 694,
      label: "БПЛА збито за місяць"
    },
    secondary: [{
      value: 48,
      label: "запитів закрили за місяць"
    }, {
      value: 11353,
      label: "БПЛА збито за весь час"
    }],
    loss: {
      amount: 13400000,
      currency: "$"
    }
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    period: "Травень 2026",
    project: "Поточний русоріз",
    palette: "potochnyi",
    hero: {
      value: 2319,
      label: "цілей уражено за місяць"
    },
    secondary: [{
      value: 50,
      label: "од. важкої бронетехніки"
    }, {
      value: 709,
      label: "од. авто / мототехніки"
    }],
    loss: {
      amount: 28600000,
      currency: "$"
    }
  }
}`,...b.parameters?.docs?.source}}},x=[`Shahedoriz`,`SkyCutter`,`Potochnyi`]}))();export{b as Potochnyi,v as Shahedoriz,y as SkyCutter,x as __namedExportsOrder,_ as default};