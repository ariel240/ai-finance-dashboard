interface AIAnalysisProps {
  analysis: string;
}

function AIAnalysis({ analysis }: AIAnalysisProps) {
  return (
    <div className="mx-8 mb-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-emerald-400 font-semibold mb-3">AI Analysis</h2>
      <p className="text-gray-300 leading-relaxed">
        {analysis || 'AI analysis will appear here once you search for a stock...'}
      </p>
    </div>
  );
}

export default AIAnalysis;