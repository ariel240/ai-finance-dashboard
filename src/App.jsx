import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsRow from './components/StatsRow';
import AIAnalysis from './components/AIAnalysis';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />
      <SearchBar />
      <StatsRow />
      <AIAnalysis />
    </div>
  );
}

export default App;