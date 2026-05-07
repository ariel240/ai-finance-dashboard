const SERVER_URL = 'https://ai-finance-dashboard-server.onrender.com';
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
    `${SERVER_URL}/api/quote/${ticker}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  return response.json();
}


export async function fetchDailyPrices(ticker: string): Promise<PricePoint[]> {
  const cached = priceCache.get(ticker);
  const now = Date.now();

  if (cached && cached.data.length > 0 && now - cached.timestamp < CACHE_DURATION_MS) {
    console.log(`Using cached data for ${ticker}`);
    return cached.data;
  }

  const response = await fetch(
    `${SERVER_URL}/api/prices/${ticker}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }

  const result = await response.json();
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
  priceHistory: PricePoint[]): Promise<string> {
  
    const response = await fetch(`${SERVER_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ticker, quote, priceHistory }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    return data.analysis;
}