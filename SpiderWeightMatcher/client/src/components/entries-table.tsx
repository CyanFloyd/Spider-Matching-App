import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Undo, ListTree, Trash, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Entry } from "@shared/schema";

const teamColorMap: Record<string, { bg: string; text: string; emoji: string; rowBg: string }> = {
  red: { bg: "bg-red-100", text: "text-red-800", emoji: "🔴", rowBg: "bg-red-50" },
  blue: { bg: "bg-blue-100", text: "text-blue-800", emoji: "🔵", rowBg: "bg-blue-50" },
  green: { bg: "bg-green-100", text: "text-green-800", emoji: "🟢", rowBg: "bg-green-50" },
  yellow: { bg: "bg-yellow-100", text: "text-yellow-800", emoji: "🟡", rowBg: "bg-yellow-50" },
  purple: { bg: "bg-purple-100", text: "text-purple-800", emoji: "🟣", rowBg: "bg-purple-50" },
  orange: { bg: "bg-orange-100", text: "text-orange-800", emoji: "🟠", rowBg: "bg-orange-50" },
  pink: { bg: "bg-pink-100", text: "text-pink-800", emoji: "🩷", rowBg: "bg-pink-50" },
  cyan: { bg: "bg-cyan-100", text: "text-cyan-800", emoji: "🩵", rowBg: "bg-cyan-50" },
  lime: { bg: "bg-lime-100", text: "text-lime-800", emoji: "🟢", rowBg: "bg-lime-50" },
  indigo: { bg: "bg-indigo-100", text: "text-indigo-800", emoji: "🟦", rowBg: "bg-indigo-50" },
  teal: { bg: "bg-teal-100", text: "text-teal-800", emoji: "🔹", rowBg: "bg-teal-50" },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-800", emoji: "💚", rowBg: "bg-emerald-50" },
  rose: { bg: "bg-rose-100", text: "text-rose-800", emoji: "🌹", rowBg: "bg-rose-50" },
  amber: { bg: "bg-amber-100", text: "text-amber-800", emoji: "🟨", rowBg: "bg-amber-50" },
  violet: { bg: "bg-violet-100", text: "text-violet-800", emoji: "🟪", rowBg: "bg-violet-50" },
  sky: { bg: "bg-sky-100", text: "text-sky-800", emoji: "🩵", rowBg: "bg-sky-50" },
  slate: { bg: "bg-slate-100", text: "text-slate-800", emoji: "⬜", rowBg: "bg-slate-50" },
  zinc: { bg: "bg-zinc-100", text: "text-zinc-800", emoji: "⚫", rowBg: "bg-zinc-50" },
  stone: { bg: "bg-stone-100", text: "text-stone-800", emoji: "🪨", rowBg: "bg-stone-50" },
  neutral: { bg: "bg-neutral-100", text: "text-neutral-800", emoji: "⚪", rowBg: "bg-neutral-50" },
  fuchsia: { bg: "bg-fuchsia-100", text: "text-fuchsia-800", emoji: "💜", rowBg: "bg-fuchsia-50" },
  crimson: { bg: "bg-red-100", text: "text-red-800", emoji: "❤️", rowBg: "bg-red-50" },
  maroon: { bg: "bg-red-100", text: "text-red-800", emoji: "🟤", rowBg: "bg-red-50" },
  navy: { bg: "bg-blue-100", text: "text-blue-800", emoji: "🔷", rowBg: "bg-blue-50" },
  gold: { bg: "bg-yellow-100", text: "text-yellow-800", emoji: "🟨", rowBg: "bg-yellow-50" },
};

export default function EntriesTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery<Entry[]>({
    queryKey: ["/api/entries"],
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entry Removed",
        description: "Fighter entry has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearEntriesMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/entries");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entries"] });
      toast({
        title: "Entries Cleared",
        description: "All entries have been cleared.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const processMatchesMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/matches/process");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({
        title: "Matches Processed",
        description: "Fight matches have been successfully generated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteEntry = (id: number) => {
    deleteEntryMutation.mutate(id);
  };

  const handleFinishInput = () => {
    clearEntriesMutation.mutate();
  };

  const handleProcessMatches = () => {
    processMatchesMutation.mutate();
  };

  if (isLoading) {
    return <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ListTree className="text-primary mr-2" />
            Current Entries
          </h2>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                if (entries.length > 0) {
                  const lastEntry = entries[entries.length - 1];
                  handleDeleteEntry(lastEntry.id);
                }
              }}
              disabled={entries.length === 0 || deleteEntryMutation.isPending}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              <Undo className="mr-2 w-4 h-4" />
              Undo Last
            </Button>
            <Button
              variant="outline"
              onClick={handleFinishInput}
              disabled={clearEntriesMutation.isPending}
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              <Check className="mr-2 w-4 h-4" />
              {clearEntriesMutation.isPending ? "Clearing..." : "Finish Input"}
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fighter Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-info-circle mr-2"></i>
                  Add more entries to see them listed here
                </td>
              </tr>
            ) : (
              (() => {
                // Group entries by fighter name and team color
                const groupedEntries = entries.reduce((acc, entry) => {
                  const key = `${entry.name}-${entry.teamColor}`;
                  if (!acc[key]) {
                    acc[key] = [];
                  }
                  acc[key].push(entry);
                  return acc;
                }, {} as Record<string, Entry[]>);

                // Create numbered entries
                return entries.map((entry, globalIndex) => {
                  const key = `${entry.name}-${entry.teamColor}`;
                  const groupEntries = groupedEntries[key];
                  const entryIndex = groupEntries.findIndex(e => e.id === entry.id) + 1;
                  const teamStyle = teamColorMap[entry.teamColor] || teamColorMap.blue;
                  
                  return (
                    <tr key={entry.id} className={`${teamStyle.rowBg} hover:opacity-80 border-l-4 border-l-${entry.teamColor}-400 ${entry.isPriority === 1 ? 'ring-2 ring-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">
                        {entryIndex}/20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${teamStyle.text} flex items-center space-x-2`}>
                          <span>{entry.name}</span>
                          {entry.isPriority === 1 && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${teamStyle.bg} ${teamStyle.text} border-2 border-${entry.teamColor}-300`}>
                          {teamStyle.emoji} {entry.teamColor.charAt(0).toUpperCase() + entry.teamColor.slice(1)} Team
                        </Badge>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${teamStyle.text}`}>
                        {entry.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {entry.isPriority === 1 ? (
                          <Badge className="bg-yellow-100 text-yellow-800 border border-yellow-300">
                            <Star className="w-3 h-3 mr-1" />
                            HIGH BET
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                            Normal
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEntry(entry.id)}
                          disabled={deleteEntryMutation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                });
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* Match Processing Button */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <Button
          onClick={handleProcessMatches}
          disabled={entries.length < 2 || processMatchesMutation.isPending}
          className="w-full bg-warning text-white hover:bg-yellow-600 font-semibold text-lg py-3"
        >
          <Zap className="mr-2 w-5 h-5" />
          {processMatchesMutation.isPending ? "Processing..." : "Match Button - Process Fights"}
        </Button>
        <p className="text-sm text-gray-600 mt-2 text-center">
          This will sort entries by weight and create optimal matchups
        </p>
      </div>
    </div>
  );
}
