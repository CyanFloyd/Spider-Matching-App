import { useQuery } from "@tanstack/react-query";
import { Trophy, Scale3d, TriangleAlert, ClipboardList } from "lucide-react";
import { MatchWithFighters } from "@shared/schema";

const teamColorMap: Record<string, { bg: string; border: string; text: string; emoji: string }> = {
  red: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", emoji: "🔴" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", emoji: "🔵" },
  green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600", emoji: "🟢" },
  yellow: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600", emoji: "🟡" },
  purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600", emoji: "🟣" },
  orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", emoji: "🟠" },
  pink: { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", emoji: "🩷" },
  cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", emoji: "🩵" },
  lime: { bg: "bg-lime-50", border: "border-lime-200", text: "text-lime-600", emoji: "🟢" },
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-600", emoji: "🟦" },
  teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-600", emoji: "🔹" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", emoji: "💚" },
  rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", emoji: "🌹" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", emoji: "🟨" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-600", emoji: "🟪" },
  sky: { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-600", emoji: "🩵" },
  slate: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", emoji: "⬜" },
  zinc: { bg: "bg-zinc-50", border: "border-zinc-200", text: "text-zinc-600", emoji: "⚫" },
  stone: { bg: "bg-stone-50", border: "border-stone-200", text: "text-stone-600", emoji: "🪨" },
  neutral: { bg: "bg-neutral-50", border: "border-neutral-200", text: "text-neutral-600", emoji: "⚪" },
  fuchsia: { bg: "bg-fuchsia-50", border: "border-fuchsia-200", text: "text-fuchsia-600", emoji: "💜" },
  crimson: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", emoji: "❤️" },
  maroon: { bg: "bg-red-50", border: "border-red-200", text: "text-red-600", emoji: "🟤" },
  navy: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", emoji: "🔷" },
  gold: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-600", emoji: "🟨" },
};

export default function MatchResults() {
  const { data: matches = [], isLoading } = useQuery<MatchWithFighters[]>({
    queryKey: ["/api/matches"],
  });

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">Loading matches...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Trophy className="text-warning mr-2" />
          Generated Matches
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Matches sorted by weight with team conflict avoidance
        </p>
      </div>

      <div className="p-6 space-y-4">
        {matches.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Matches Generated Yet</h3>
            <p className="text-sm">Add entries and click "Match Button" to generate fights</p>
          </div>
        ) : (
          matches.map((match) => {
            const fighter1Style = teamColorMap[match.fighter1.teamColor] || teamColorMap.blue;
            const fighter2Style = teamColorMap[match.fighter2.teamColor] || teamColorMap.blue;
            const isExactMatch = match.matchType === "exact";

            return (
              <div
                key={match.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Fight #{match.fightNumber}
                    </span>
                    <span className="text-sm text-gray-500">Weight Class: {match.weightClass}</span>
                  </div>
                  <div className={`text-xs ${isExactMatch ? "text-green-600" : "text-yellow-600"}`}>
                    {isExactMatch ? (
                      <>
                        <Scale3d className="w-3 h-3 mr-1 inline" />
                        Perfect Match
                      </>
                    ) : (
                      <>
                        <TriangleAlert className="w-3 h-3 mr-1 inline" />
                        Tolerance (±3)
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Fighter 1 */}
                  <div className={`${fighter1Style.bg} border-2 ${fighter1Style.border} rounded-lg p-4 text-center`}>
                    <div className={`${fighter1Style.text.replace('text-', 'bg-')} text-white px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block`}>
                      {fighter1Style.emoji} {match.fighter1.teamColor.charAt(0).toUpperCase() + match.fighter1.teamColor.slice(1)} Team
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{match.fighter1.name}</h3>
                    <p className={`text-2xl font-bold ${fighter1Style.text}`}>{match.fighter1.weight}</p>
                    <p className="text-xs text-gray-500">lbs</p>
                  </div>

                  {/* VS Indicator */}
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-gray-600">VS</span>
                    </div>
                  </div>

                  {/* Fighter 2 */}
                  <div className={`${fighter2Style.bg} border-2 ${fighter2Style.border} rounded-lg p-4 text-center`}>
                    <div className={`${fighter2Style.text.replace('text-', 'bg-')} text-white px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block`}>
                      {fighter2Style.emoji} {match.fighter2.teamColor.charAt(0).toUpperCase() + match.fighter2.teamColor.slice(1)} Team
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{match.fighter2.name}</h3>
                    <p className={`text-2xl font-bold ${fighter2Style.text}`}>{match.fighter2.weight}</p>
                    <p className="text-xs text-gray-500">lbs</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
