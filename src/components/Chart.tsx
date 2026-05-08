import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { PricePoint } from '../api';

interface ChartProps {
  data: PricePoint[];
  ticker: string | null;
}

function Chart({ data, ticker }: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 h-full flex flex-col">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Price History
        </h2>
        <div className="h-48 flex items-center justify-center">
          <p className="text-gray-600 text-sm">Chart will appear here...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 h-full flex flex-col">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        {ticker} — Last 30 Days
      </h2>
      <div className="flex-1 w-full min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 45, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="date"
              tick={{ fill: '#475569', fontSize: 11 }}
              dy={10}
              tickFormatter={(date: unknown) => {
                if (typeof date !== 'string') return '';
                const parts = date.split('-');
                return `${parts[2]}/${parts[1]}`;
              }}
            />
            <YAxis
              tick={{ fill: '#475569', fontSize: 11 }}
              width={45}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#34d399' }}
              formatter={(value: unknown) => {
                if (typeof value === 'number') {
                  return [`$${value.toFixed(2)}`, 'Price'];
                }
                return ['--', 'Price'];
              }}
              labelFormatter={(date: unknown) => {
                if (typeof date !== 'string') return '';
                const parts = date.split('-');
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#34d399"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Chart;