import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/panel";
import { PLAYERS } from "@/lib/data";
import { TrophyIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Scoreboard",
  description: "The live DARKHACK leaderboard — top operators by points and flags.",
};

const podiumAccent = [
  "border-amber/50 text-amber shadow-[0_0_30px_-10px_rgba(251,191,36,0.6)]",
  "border-muted/50 text-foreground",
  "border-amber/30 text-amber/70",
];

export default function ScoreboardPage() {
  const [first, second, third] = PLAYERS;
  const podium = [second, first, third]; // visual order: 2 · 1 · 3

  return (
    <>
      <PageHeader
        breadcrumb="~/ scoreboard"
        title={
          <>
            Live <span className="text-cyan text-glow-cyan">standings</span>
          </>
        }
        description="Season 04, ranked by total points. Ties break on flags captured, then on speed to first blood."
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-xs text-muted">
          <span className="size-1.5 animate-pulse rounded-full bg-cyan" />
          updated in real time
        </span>
      </PageHeader>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {/* Podium */}
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-5">
          {podium.map((p, i) => {
            const place = p.rank;
            const heights = ["h-32", "h-44", "h-28"];
            return (
              <div key={p.handle} className="flex flex-col items-center">
                <div
                  className={`mb-3 grid size-12 place-items-center rounded-full border bg-surface ${podiumAccent[place - 1]}`}
                >
                  <TrophyIcon className="size-6" />
                </div>
                <p className="font-mono text-sm font-semibold text-foreground">
                  @{p.handle}
                </p>
                <p className="font-mono text-xs text-muted">
                  {p.points.toLocaleString()} pts
                </p>
                <div
                  className={`mt-3 flex w-full items-start justify-center rounded-t-lg border border-b-0 border-border bg-surface/70 pt-3 font-mono text-2xl font-bold text-muted-2 ${heights[i]}`}
                >
                  #{place}
                </div>
              </div>
            );
          })}
        </div>

        {/* Full table */}
        <Panel chrome title="leaderboard --all" className="mt-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left font-mono text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-2">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-4 py-3 font-medium">operator</th>
                  <th className="px-4 py-3 text-right font-medium">points</th>
                  <th className="px-4 py-3 text-right font-medium">flags</th>
                  <th className="px-4 py-3 text-right font-medium">streak</th>
                </tr>
              </thead>
              <tbody>
                {PLAYERS.map((p) => (
                  <tr
                    key={p.handle}
                    className="border-b border-border/60 transition-colors last:border-0 hover:bg-surface-2/60"
                  >
                    <td className="px-4 py-3 text-muted-2">
                      {p.rank <= 3 ? (
                        <span className="text-amber">{p.rank}</span>
                      ) : (
                        p.rank
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground">@{p.handle}</span>
                      <span className="ml-2 text-[11px] text-muted-2">
                        {p.country}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-primary">
                      {p.points.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">
                      {p.flags}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-cyan">×{p.streak}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </>
  );
}
