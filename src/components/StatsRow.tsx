import { StockQuote, formatVolume} from '../api';

interface StatsRowProps {
  quote: StockQuote | null;
}

interface StatCardProps {
  label: string;
  value: string;
  color?: string;
}

function StatCard({ label, value, color = 'text-white' }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function StatsRow({ quote }: StatsRowProps) {
  const isPositive = quote ? quote.change >= 0 : null;

  return (
    <div className="grid grid-cols-3 gap-4 px-8 pb-6">
      <StatCard
        label="Price"
        value={quote ? `$${quote.price.toFixed(2)}` : '--'}
      />
      <StatCard
        label="Change"
        value={quote ? `${isPositive ? '+' : ''}${quote.changePercent.toFixed(2)}%` : '--'}
        color={quote ? (isPositive ? 'text-emerald-400' : 'text-red-400') : 'text-gray-600'}
      />
      <StatCard
        label="Volume"
        value={quote ? formatVolume(quote.volume) : '--'}
      />
    </div>
  );
}

export default StatsRow;