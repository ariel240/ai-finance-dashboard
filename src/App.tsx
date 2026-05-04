import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsRow from './components/StatsRow';
import AIAnalysis from './components/AIAnalysis';
import Watchlist from './components/Watchlist';
import Chart from './components/Chart'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Watchlist />
        <main className="flex-1">
          <SearchBar />
          <StatsRow />
          <Chart />
          <AIAnalysis />
        </main>
      </div>
    </div>
  );
}

export default App;