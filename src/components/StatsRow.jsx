function StatsRow() {
  return (
    <div className="grid grid-cols-3 gap-4 px-8 pb-6">
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Price</p>
        <p className="text-2xl font-bold text-white">$142.50</p>
      </div>
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Change</p>
        <p className="text-2xl font-bold text-emerald-400">+2.3%</p>
      </div>
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Volume</p>
        <p className="text-2xl font-bold text-white">1.2M</p>
      </div>
    </div>
  );
}

export default StatsRow;