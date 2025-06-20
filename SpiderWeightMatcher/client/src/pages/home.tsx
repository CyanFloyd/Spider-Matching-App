import { Users, Goal } from "lucide-react";
import EntryForm from "@/components/entry-form";
import EntriesTable from "@/components/entries-table";
import MatchResults from "@/components/match-results";

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Goal className="text-primary text-2xl" />
              <h1 className="text-2xl font-bold text-gray-900">Spider Weight Matching</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>Tournament Manager</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EntryForm />
        <EntriesTable />
        <MatchResults />

        {/* Algorithm Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <i className="fas fa-info-circle mr-2"></i>
            Matching Algorithm
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <h4 className="font-medium">Weight Matching Rules:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>3-digit weights only (100-999)</li>
                <li>Exact weight matches prioritized</li>
                <li>Tolerance matches within ±3 range</li>
                <li>Sorted smallest to highest weight</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Fight Distribution:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Priority bets matched first with best weights</li>
                <li>Maximum 2 fights per fighter</li>
                <li>Same team fighters cannot match</li>
                <li>Equal distribution across all entries</li>
                <li>Auto-generated fight numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
