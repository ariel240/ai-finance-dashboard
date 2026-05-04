interface WatchlistProps {
  watchlist: string[];
  onSelect: (ticker: string) => void;
  onRemove: (ticker: string) => void;
}

function Watchlist({ watchlist, onSelect, onRemove }: WatchlistProps) {
  return (
    <aside className="w-52 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Watchlist
      </h2>
      
      {watchlist.length === 0 && (
        <p className="text-gray-600 text-sm">No stocks yet. Search and add one!</p>
      )}

      <ul className="flex flex-col gap-2">
        {watchlist.map((ticker) => (
          <li
            key={ticker}
            className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-2 group"
          >
            <button
              onClick={() => onSelect(ticker)}
              className="text-white font-semibold hover:text-emerald-400 transition-colors"
            >
              {ticker}
            </button>
            <button
              onClick={() => onRemove(ticker)}
              className="text-gray-600 hover:text-red-400 transition-colors text-xs opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </aside>

  );
}

export default Watchlist;
