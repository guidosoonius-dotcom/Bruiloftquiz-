import { LeaderboardEntry } from "@/hooks/useLeaderboard";

const PODIUM_STYLES = [
  { medal: "🥇", bg: "bg-amber-200", height: "h-28" },
  { medal: "🥈", bg: "bg-zinc-200", height: "h-20" },
  { medal: "🥉", bg: "bg-orange-200", height: "h-14" },
];

const PODIUM_STYLES_LARGE = [
  { medal: "🥇", bg: "bg-amber-200", height: "h-64" },
  { medal: "🥈", bg: "bg-zinc-200", height: "h-48" },
  { medal: "🥉", bg: "bg-orange-200", height: "h-36" },
];

export function ScoreboardList({
  leaderboard,
  ownPlayerId,
  limit = 10,
  size = "default",
}: {
  leaderboard: LeaderboardEntry[];
  ownPlayerId?: string | null;
  limit?: number;
  /** "large" voor het beamerscherm */
  size?: "default" | "large";
}) {
  const large = size === "large";
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, limit);
  const ownRank = ownPlayerId ? leaderboard.findIndex((e) => e.playerId === ownPlayerId) : -1;
  const ownEntry = ownRank >= 0 ? leaderboard[ownRank] : null;
  const ownVisible = ownRank >= 0 && ownRank < limit;

  const order = [1, 0, 2];
  const podiumStyles = large ? PODIUM_STYLES_LARGE : PODIUM_STYLES;

  return (
    <div className={large ? "space-y-10" : "space-y-6"}>
      {top3.length > 0 && (
        <div className={large ? "flex items-end justify-center gap-8" : "flex items-end justify-center gap-3"}>
          {order.map((i) => {
            const entry = top3[i];
            if (!entry) return <div key={i} className={large ? "w-48" : "w-24"} />;
            const style = podiumStyles[i];
            return (
              <div
                key={entry.playerId}
                className={`animate-rise-in flex flex-col items-center gap-1 ${large ? "w-48" : "w-24"}`}
                style={{ animationDelay: `${(2 - i) * 150}ms` }}
              >
                <span className={large ? "text-6xl" : "text-2xl"}>{style.medal}</span>
                <p
                  className={
                    large
                      ? "max-w-48 truncate text-center text-2xl font-semibold text-ink"
                      : "max-w-24 truncate text-center text-sm font-semibold text-ink"
                  }
                >
                  {entry.name}
                </p>
                <div
                  className={`animate-grow-up flex w-full ${style.height} items-start justify-center rounded-t-2xl ${style.bg} shadow-sm ${large ? "pt-4" : "pt-2"}`}
                  style={{ animationDelay: `${(2 - i) * 150 + 120}ms` }}
                >
                  <span className={large ? "text-3xl font-bold text-ink" : "text-sm font-bold text-ink"}>
                    {entry.score}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <ol start={4} className={large ? "mx-auto max-w-2xl space-y-3" : "space-y-2"}>
          {rest.map((entry, i) => (
            <li
              key={entry.playerId}
              style={{ animationDelay: `${450 + i * 40}ms` }}
              className={`animate-rise-in flex items-center justify-between rounded-xl shadow-sm ${
                large ? "px-6 py-4 text-xl" : "px-4 py-2"
              } ${entry.playerId === ownPlayerId ? "bg-lavender-deep/30" : "bg-white/70"}`}
            >
              <span className={large ? "text-ink-soft" : "text-sm text-ink-soft"}>
                {i + 4}. <span className="font-semibold text-ink">{entry.name}</span>
              </span>
              <span className={large ? "font-bold text-ink" : "text-sm font-bold text-ink"}>
                {entry.score}
              </span>
            </li>
          ))}
        </ol>
      )}

      {ownEntry && !ownVisible && (
        <div className="flex items-center justify-between rounded-xl bg-lavender-deep/30 px-4 py-2 shadow-sm">
          <span className="text-sm text-ink-soft">
            {ownRank + 1}. <span className="font-semibold text-ink">{ownEntry.name}</span> (jij)
          </span>
          <span className="text-sm font-bold text-ink">{ownEntry.score}</span>
        </div>
      )}

      {leaderboard.length === 0 && (
        <p className="text-center text-sm text-ink-soft">Nog geen scores binnen.</p>
      )}
    </div>
  );
}
