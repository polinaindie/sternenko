import{i as e}from"./preload-helper-xPQekRTU.js";import{t,w as n}from"./iframe-DquaFbOf.js";import{n as r,t as i}from"./utils-D8qMR3V9.js";import{i as a,n as o}from"./report-metric-brauwEAD.js";import{n as s,t as c}from"./report-card-C207aCV1.js";import{a as l,n as u,t as d}from"./metric-bar-DWGL1PlF.js";function f({className:e,palette:t=`shahedoriz`,summary:n,items:r,emptyMessage:a=`Немає даних для розподілу.`}){let s=r.filter(e=>e.percent>0);return(0,p.jsx)(`section`,{"data-slot":`donation-breakdown-chart`,"data-report-palette":t,className:i(`bg-foreground text-background w-full overflow-hidden rounded-[var(--radius-report-lg)] p-3 md:p-4`,e),children:(0,p.jsxs)(c,{tone:`accent`,className:`gap-6`,children:[(0,p.jsx)(o,{value:n.value,label:n.label,size:n.size??`lg`}),s.length>0?(0,p.jsx)(`div`,{className:`w-full overflow-x-auto`,children:(0,p.jsx)(u,{className:`min-w-[min(100%,28rem)] w-full`,children:s.map(e=>(0,p.jsx)(d,{percent:e.percent,label:e.label,valueLabel:e.valueLabel,valueCaption:e.valueCaption,renderFill:e.renderFill},e.id))})}):(0,p.jsx)(`p`,{className:`text-primary-foreground/80 text-sm`,children:a})]})})}var p,m=e((()=>{n(),l(),a(),s(),r(),p=t(),f.__docgenInfo={description:`Діаграма розбивки у стилі звіту по донатах:
темне полотно → accent-картка → hero-метрика + вертикальні MetricBar.`,methods:[],displayName:`DonationBreakdownChart`,props:{className:{required:!1,tsType:{name:`string`},description:``},palette:{required:!1,tsType:{name:`string`},description:``,defaultValue:{value:`"shahedoriz"`,computed:!1}},summary:{required:!0,tsType:{name:`signature`,type:`object`,raw:`{
  value: number | string
  label: React.ReactNode
  size?: "sm" | "default" | "lg"
}`,signature:{properties:[{key:`value`,value:{name:`union`,raw:`number | string`,elements:[{name:`number`},{name:`string`}],required:!0}},{key:`label`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}},{key:`size`,value:{name:`union`,raw:`"sm" | "default" | "lg"`,elements:[{name:`literal`,value:`"sm"`},{name:`literal`,value:`"default"`},{name:`literal`,value:`"lg"`}],required:!1}}]}},description:``},items:{required:!0,tsType:{name:`Array`,elements:[{name:`signature`,type:`object`,raw:`{
  id: string
  percent: number
  label: React.ReactNode
  valueLabel?: React.ReactNode
  valueCaption?: React.ReactNode
  renderFill?: (clampedPercent: number) => React.ReactNode
}`,signature:{properties:[{key:`id`,value:{name:`string`,required:!0}},{key:`percent`,value:{name:`number`,required:!0}},{key:`label`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!0}},{key:`valueLabel`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!1}},{key:`valueCaption`,value:{name:`ReactReactNode`,raw:`React.ReactNode`,required:!1}},{key:`renderFill`,value:{name:`signature`,type:`function`,raw:`(clampedPercent: number) => React.ReactNode`,signature:{arguments:[{type:{name:`number`},name:`clampedPercent`}],return:{name:`ReactReactNode`,raw:`React.ReactNode`}},required:!1}}]}}],raw:`DonationBreakdownChartItem[]`},description:``},emptyMessage:{required:!1,tsType:{name:`ReactReactNode`,raw:`React.ReactNode`},description:``,defaultValue:{value:`"Немає даних для розподілу."`,computed:!1}}}}})),h,g,_,v,y,b;e((()=>{m(),h=t(),g={title:`Report/Donation Breakdown Chart`,component:f,tags:[`autodocs`],parameters:{layout:`padded`}},_=[{id:`Поточний`,percent:46,label:`Поточний`,valueLabel:`36`,valueCaption:`запитів`,color:`#829474`},{id:`Небесний`,percent:21,label:`Небесний`,valueLabel:`16`,valueCaption:`запитів`,color:`#59CBE7`},{id:`Секретний`,percent:17,label:`Секретний`,valueLabel:`13`,valueCaption:`запитів`,color:`#FE6A34`},{id:`РеДрон`,percent:8,label:`РеДрон`,valueLabel:`6`,valueCaption:`запитів`,color:`#DCDCDC`},{id:`Шахедоріз`,percent:8,label:`Шахедоріз`,valueLabel:`6`,valueCaption:`запитів`,color:`#FFD62E`}],v={args:{summary:{value:77,label:`закритих запитів загалом`},items:_.map(e=>({id:e.id,percent:e.percent,label:e.label,valueLabel:e.valueLabel,valueCaption:e.valueCaption,renderFill:t=>(0,h.jsx)(`div`,{className:`absolute inset-x-0 bottom-0`,style:{height:`${t}%`,backgroundColor:e.color}})}))}},y={args:{summary:{value:`12 408`,label:`надходжень`},items:[{id:`lt100`,percent:47,label:`< 100`},{id:`100-500`,percent:40,label:`100 - 500`},{id:`500-1000`,percent:7,label:`500 - 1000`},{id:`1000-5000`,percent:5,label:`1000 - 5000`},{id:`gt5000`,percent:1,label:`5000 <`}],palette:`donations`}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    summary: {
      value: 77,
      label: "закритих запитів загалом"
    },
    items: issuanceProjects.map(project => ({
      id: project.id,
      percent: project.percent,
      label: project.label,
      valueLabel: project.valueLabel,
      valueCaption: project.valueCaption,
      renderFill: clamped => <div className="absolute inset-x-0 bottom-0" style={{
        height: \`\${clamped}%\`,
        backgroundColor: project.color
      }} />
    }))
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    summary: {
      value: "12 408",
      label: "надходжень"
    },
    items: [{
      id: "lt100",
      percent: 47,
      label: "< 100"
    }, {
      id: "100-500",
      percent: 40,
      label: "100 - 500"
    }, {
      id: "500-1000",
      percent: 7,
      label: "500 - 1000"
    }, {
      id: "1000-5000",
      percent: 5,
      label: "1000 - 5000"
    }, {
      id: "gt5000",
      percent: 1,
      label: "5000 <"
    }],
    palette: "donations"
  }
}`,...y.parameters?.docs?.source}}},b=[`IssuanceClosedRequests`,`DonationAmountBuckets`]}))();export{y as DonationAmountBuckets,v as IssuanceClosedRequests,b as __namedExportsOrder,g as default};