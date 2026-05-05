const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export interface StockQuote {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

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