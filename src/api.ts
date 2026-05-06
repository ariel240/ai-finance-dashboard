const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; 

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface PricePoint {
  date: string;
  price: number;
}

interface CacheEntry {
  data: PricePoint[];
  timestamp: number;
}
const priceCache = new Map<string, CacheEntry>();

export async function fetchStockQuote(ticker: string): Promise<StockQuote> {
  const response = await fetch(
    `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${API_KEY}`
  );

  const data = await response.json();
  const quote = data['Global Quote'];

  return {
    ticker,
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent']),
    volume: parseInt(quote['06. volume']),
  };
}

export async function fetchDailyPrices(ticker: string): Promise<PricePoint[]> {
  const cached = priceCache.get(ticker);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_DURATION_MS) {
    console.log(`Using cached data for ${ticker}`);
    return cached.data;
  }

  const response = await fetch(
    `${BASE_URL}?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${API_KEY}`
  );

  const data = await response.json();
  const timeSeries = data['Time Series (Daily)'];

  if (!timeSeries) {
    console.error('No time series data:', data);
    console.error('Full response:', JSON.stringify(data));
    return [];
  }
  const result = Object.entries(timeSeries)
    .slice(0, 30)
    .reverse()
    .map(([date, values]: [string, any]) => ({
      date,
      price: parseFloat((values as any)['4. close']),
    }));
  priceCache.set(ticker, { data: result, timestamp: now });
  return result;
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000_000) {
    return `${(volume / 1_000_000_000).toFixed(1)}B`;
  }
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(1)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(1)}K`;
  }
  return volume.toString();
}

export async function fetchAIAnalysis(
  ticker: string,
  quote: StockQuote,
  priceHistory: PricePoint[]
): Promise<string> {
  const response = await fetch('http://localhost:3001/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker, quote, priceHistory }),
  });

  const data = await response.json();
  return data.analysis;
}