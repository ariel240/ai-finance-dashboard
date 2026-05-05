import { useState } from 'react';
import { fetchStockQuote, StockQuote } from './api';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsRow from './components/StatsRow';
import AIAnalysis from './components/AIAnalysis';
import Watchlist from './components/Watchlist';
import Chart from './components/Chart'

function App() {
  const [searchSymbol, setSearchSymbol] = useState<string>('');
  const [watchlist, setWatchlist] = useState<string[]>(['AAPL', 'GOOGL', 'TSLA']);

  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function handleSelectFromWatchlist(ticker: string): void {
    setSearchSymbol(ticker);
  }

  function handleAddToWatchlist(ticker: string): void {
    if (ticker && !watchlist.includes(ticker)) {
      setWatchlist([...watchlist, ticker.toUpperCase()]);
    }
  }

  function handleRemoveFromWatchlist(ticker: string): void {
    setWatchlist(watchlist.filter(t => t !== ticker));
  }

  async function handleAnalyze(): Promise<void> {
    if (!searchSymbol) return;
    setIsLoading(true);
    try {
      const data = await fetchStockQuote(searchSymbol);
      setQuote(data);
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Watchlist
          watchlist={watchlist}
          onSelect={handleSelectFromWatchlist}
          onRemove={handleRemoveFromWatchlist}
        />
        <main className="flex-1">
          <SearchBar
            searchSymbol={searchSymbol}
            onSearchChange={setSearchSymbol}
            onAddToWatchlist={handleAddToWatchlist}
          />
          <StatsRow />
          <Chart />
          <AIAnalysis />
        </main>
      </div>
    </div>
  );
}

export default App;