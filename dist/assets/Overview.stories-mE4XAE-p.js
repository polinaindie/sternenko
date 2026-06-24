import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./iframe-DquaFbOf.js";import{n,t as r}from"./utils-D8qMR3V9.js";import{a as i,i as a,n as o,r as s,t as c}from"./tabs-CDKZL2wH.js";import{n as l,t as u}from"./page-shell-CMLkopPY.js";import{r as d,t as f}from"./button-CUWbcrF0.js";import{a as p,n as m,o as h,r as g,s as _,t as v}from"./card-DqSye2Wa.js";import{n as y,t as b}from"./label-uYZneAXz.js";import{n as x,t as S}from"./input-DIOXZEdd.js";import{n as C,t as w}from"./badge-BOqdPL86.js";import{n as T,t as E}from"./switch-Bo1ycGJm.js";import{n as D,t as O}from"./checkbox-BrDlj0Ae.js";import{n as k,t as A}from"./progress-BgVV8d4b.js";function j({className:e,...t}){return(0,M.jsx)(`div`,{"data-slot":`container`,className:r(`mx-auto w-full max-w-[var(--container-max)] px-[var(--page-gutter)] md:px-[var(--page-gutter-md)] lg:px-[var(--page-gutter-lg)]`,e),...t})}var M,N=e((()=>{n(),M=t(),j.__docgenInfo={description:``,methods:[],displayName:`Container`}})),P,F,I,L;e((()=>{C(),d(),_(),D(),x(),y(),k(),T(),i(),N(),l(),P=t(),F={title:`Overview/Theme Preview`,parameters:{layout:`fullscreen`}},I={render:()=>(0,P.jsx)(u,{children:(0,P.jsx)(j,{className:`py-10 md:py-16`,children:(0,P.jsx)(`div`,{className:`mx-auto max-w-md`,children:(0,P.jsxs)(v,{children:[(0,P.jsxs)(p,{children:[(0,P.jsx)(h,{children:`Use the toolbar to re-skin`}),(0,P.jsx)(g,{children:`Switch the brand theme and light/dark above — every component updates from CSS variables, no code changes.`})]}),(0,P.jsxs)(m,{className:`flex flex-col gap-6`,children:[(0,P.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,P.jsx)(f,{children:`Primary`}),(0,P.jsx)(f,{variant:`secondary`,children:`Secondary`}),(0,P.jsx)(f,{variant:`outline`,children:`Outline`}),(0,P.jsx)(w,{children:`Badge`})]}),(0,P.jsxs)(`div`,{className:`grid gap-2`,children:[(0,P.jsx)(b,{htmlFor:`email`,children:`Email`}),(0,P.jsx)(S,{id:`email`,placeholder:`you@example.com`})]}),(0,P.jsxs)(`div`,{className:`flex items-center gap-6`,children:[(0,P.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,P.jsx)(O,{id:`terms`,defaultChecked:!0}),(0,P.jsx)(b,{htmlFor:`terms`,className:`font-normal`,children:`Accept terms`})]}),(0,P.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,P.jsx)(E,{id:`emails`,defaultChecked:!0}),(0,P.jsx)(b,{htmlFor:`emails`,className:`font-normal`,children:`Emails`})]})]}),(0,P.jsx)(A,{value:62}),(0,P.jsxs)(c,{defaultValue:`overview`,children:[(0,P.jsxs)(s,{children:[(0,P.jsx)(a,{value:`overview`,children:`Overview`}),(0,P.jsx)(a,{value:`details`,children:`Details`})]}),(0,P.jsx)(o,{value:`overview`,className:`text-muted-foreground pt-2 text-sm`,children:`One component library, many brands.`}),(0,P.jsx)(o,{value:`details`,className:`text-muted-foreground pt-2 text-sm`,children:`Tokens drive color, radius, shadow and font.`})]})]})]})})})})},I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => <PageShell>
      <Container className="py-10 md:py-16">
        <div className="mx-auto max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Use the toolbar to re-skin</CardTitle>
              <CardDescription>
                Switch the brand theme and light/dark above — every component
                updates from CSS variables, no code changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Badge>Badge</Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox id="terms" defaultChecked />
                  <Label htmlFor="terms" className="font-normal">
                    Accept terms
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="emails" defaultChecked />
                  <Label htmlFor="emails" className="font-normal">
                    Emails
                  </Label>
                </div>
              </div>

              <Progress value={62} />

              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="text-muted-foreground pt-2 text-sm">
                  One component library, many brands.
                </TabsContent>
                <TabsContent value="details" className="text-muted-foreground pt-2 text-sm">
                  Tokens drive color, radius, shadow and font.
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Container>
    </PageShell>
}`,...I.parameters?.docs?.source}}},L=[`Panel`]}))();export{I as Panel,L as __namedExportsOrder,F as default};