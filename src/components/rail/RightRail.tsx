import { alertsData, homeData } from "@/data";
import { AiDailyPulse } from "./AiDailyPulse";
import { LiveAlerts } from "./LiveAlerts";
import { MarketsEndingSoon } from "./MarketsEndingSoon";
import { RecentlyResolved } from "./RecentlyResolved";
import { TopMovers } from "./TopMovers";

/** Fixed 320px column of intelligence panels on the right. */
export function RightRail() {
  return (
    <aside className="anim-rail flex w-80 shrink-0 flex-col gap-5">
      <AiDailyPulse pulse={homeData.aiPulse} />
      <LiveAlerts alerts={alertsData.liveAlerts} />
      <MarketsEndingSoon markets={alertsData.endingSoon} />
      <TopMovers movers={alertsData.topMovers} />
      <RecentlyResolved markets={alertsData.recentlyResolved} />
    </aside>
  );
}
