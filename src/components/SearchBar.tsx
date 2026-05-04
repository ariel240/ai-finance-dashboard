interface SearchBarProps {
  searchSymbol: string;
  onSearchChange: (value: string) => void;
  onAddToWatchlist: (ticker: string) => void;
}

function SearchBar({ searchSymbol, onSearchChange, onAddToWatchlist }: SearchBarProps) {
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
      <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-2 rounded-lg transition-colors">
        Analyze
      </button>
    </div>
  );
}

export default SearchBar;