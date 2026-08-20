import { LeaderboardEntry } from "@/hooks/useLeaderboard";

const PODIUM_STYLES = [
  { medal: "🥇", bg: "bg-amber-200", height: "h-28" },
  { medal: "🥈", bg: "bg-zinc-200", height: "h-20" },
  { medal: "🥉", bg: "bg-orange-200", height: "h-14" },
];

export function ScoreboardList({
  leaderboard,
  ownPlayerId,
  limit = 10,
}: {
  leaderboard: LeaderboardEntry[];
  ownPlayerId?: string | null;
  limit?: number;
}) {
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3, limit);
  const ownRank = ownPlayerId ? leaderboard.findIndex((e) => e.playerId === ownPlayerId) : -1;
  const ownEntry = ownRank >= 0 ? leaderboard[ownRank] : null;
  const ownVisible = ownRank >= 0 && ownRank < limit;

  const order = [1, 0, 2];

  return (
    <div className="space-y-6">
      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-3">
          {order.map((i) => {
            const entry = top3[i];
            if (!entry) return <div key={i} className="w-24" />;
            const style = PODIUM_STYLES[i];
            return (
              <div key={entry.playerId} className="flex w-24 flex-col items-center gap-1">
                <span className="text-2xl">{style.medal}</span>
                <p className="max-w-24 truncate text-center text-sm font-semibold text-ink">
                  {entry.name}
                </p>
                <div
                  className={`flex w-full ${style.height} items-start justify-center rounded-t-2xl ${style.bg} pt-2 shadow-sm`}
                >
                  <span className="text-sm font-bold text-ink">{entry.score}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {rest.length > 0 && (
        <ol start={4} className="space-y-2">
          {rest.map((entry, i) => (
            <li
              key={entry.playerId}
              className={`flex items-center justify-between rounded-xl px-4 py-2 shadow-sm ${
                entry.playerId === ownPlayerId ? "bg-lavender-deep/30" : "bg-white/70"
              }`}
            >
              <span className="text-sm text-ink-soft">
                {i + 4}. <span className="font-semibold text-ink">{entry.name}</span>
              </span>
              <span className="text-sm font-bold text-ink">{entry.score}</span>
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
