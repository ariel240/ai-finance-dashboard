interface SearchBarProps {
  searchSymbol: string;
  onSearchChange: (value: string) => void;
  onAddToWatchlist: (ticker: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

function SearchBar({ searchSymbol, onSearchChange, onAddToWatchlist, onAnalyze, isLoading }: SearchBarProps) {
  return (
    <div className="flex gap-3 px-8 py-6">
      <input
        type="text"
        value={searchSymbol}
        onChange={(e) => onSearchChange(e.target.value.toUpperCase())}
        placeholder="Enter a stock symbol..."
        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
      />
      <button
        onClick={() => onAddToWatchlist(searchSymbol)}
        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
        + Watchlist
      </button>
      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-900 disabled:text-emerald-700 text-black font-semibold px-6 py-2 rounded-lg transition-colors"
      >
        {isLoading ? 'Loading...' : 'Analyze'}
      </button>
    </div>
  );
}

export default SearchBar;