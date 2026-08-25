import { HandoverFeed } from "./HandoverFeed"
import demoStyles from "./HandoverFeedDemo.module.css"
import { HANDOVER_FEED_MOCK } from "./handover-feed.mock"

/**
 * Standalone demo — swap into App.tsx to preview:
 *
 *   import { HandoverFeedDemo } from "./components/handover-feed/HandoverFeed.demo"
 *   export function App() { return <HandoverFeedDemo /> }
 */
export function HandoverFeedDemo() {
  return (
    <main className={demoStyles.wrapper}>
      <header className={demoStyles.header}>Журнал передач — demo</header>
      <HandoverFeed days={HANDOVER_FEED_MOCK} />
    </main>
  )
}
