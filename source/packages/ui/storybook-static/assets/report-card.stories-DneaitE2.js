import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{n,t as r}from"./report-card-C207aCV1.js";var i,a,o,s,c;e((()=>{n(),i=t(),a={title:`Report/Report Card`,component:r,tags:[`autodocs`],argTypes:{tone:{control:`inline-radio`,options:[`accent`,`contrast`,`card`,`muted`,`outline`]},size:{control:`inline-radio`,options:[`default`,`lg`]}}},o={args:{tone:`accent`,children:(0,i.jsx)(`p`,{className:`text-sm uppercase`,children:`Жовтий акцент-блок звіту`}),className:`w-72`}},s={render:()=>(0,i.jsx)(`div`,{className:`grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-3`,children:[`accent`,`contrast`,`card`,`muted`,`outline`].map(e=>(0,i.jsx)(r,{tone:e,children:(0,i.jsx)(`p`,{className:`text-sm uppercase`,children:e})},e))})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    tone: "accent",
    children: <p className="text-sm uppercase">Жовтий акцент-блок звіту</p>,
    className: "w-72"
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid w-full max-w-3xl grid-cols-2 gap-3 md:grid-cols-3">
      {(["accent", "contrast", "card", "muted", "outline"] as const).map(tone => <ReportCard key={tone} tone={tone}>
            <p className="text-sm uppercase">{tone}</p>
          </ReportCard>)}
    </div>
}`,...s.parameters?.docs?.source}}},c=[`Accent`,`Tones`]}))();export{o as Accent,s as Tones,c as __namedExportsOrder,a as default};