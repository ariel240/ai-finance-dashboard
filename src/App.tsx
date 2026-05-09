import { useState, useEffect } from 'react';
import { fetchStockQuote, StockQuote, fetchDailyPrices, PricePoint, fetchAIAnalysis } from './api';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsRow from './components/StatsRow';
import AIAnalysis from './components/AIAnalysis';
import Watchlist from './components/Watchlist';
import Chart from './components/Chart'

function App() {
  const [searchSymbol, setSearchSymbol] = useState<string>('');
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : ['AAPL', 'GOOGL', 'TSLA'];
  });
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

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
      const [quoteData, priceData] = await Promise.all([
        fetchStockQuote(searchSymbol),
        fetchDailyPrices(searchSymbol)
      ]);
      setQuote(quoteData);
      setPriceHistory(priceData);

      const analysisData = await fetchAIAnalysis(searchSymbol, quoteData, priceData);
      setAnalysis(analysisData);

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
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="max-w-7xl mx-auto w-full flex flex-col flex-1">
            <SearchBar
              searchSymbol={searchSymbol}
              onSearchChange={setSearchSymbol}
              onAddToWatchlist={handleAddToWatchlist}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
            />
            <StatsRow
              quote={quote} />
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px] ">
                <Chart data={priceHistory} ticker={searchSymbol || null} />
                <AIAnalysis analysis={analysis} />
              </div>
            </div>
          </div>

        </main>
      </div >
    </div >
  );
}

export default App;