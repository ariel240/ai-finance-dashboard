import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import YahooFinance from 'yahoo-finance2';

dotenv.config();

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey', 'ripHistorical'],
  cookieJar: true,
});
const server = express();
const PORT = 3001;

server.use(cors({
  origin: [
    'http://localhost:5173',
    'https://ai-finance-dashboard-zeta.vercel.app'
  ]
}));
server.use(express.json());


server.post('/api/analyze', async (req, res) => {
  const { ticker, quote, priceHistory } = req.body;

  const prompt = `You are a professional financial analyst. Analyze the following stock data for ${ticker} 
  and provide a concise 3-4 sentence analysis of the stock's recent performance and outlook.

Current Data:
- Price: $${quote.price.toFixed(2)}
- Change: ${quote.changePercent.toFixed(2)}%
- Volume: ${quote.volume}

Last 30 days price history (oldest to newest):
${priceHistory.map(p => `${p.date}: $${p.price.toFixed(2)}`).join('\n')}

Provide a professional, data-driven analysis. Do not give financial advice.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    res.json({ analysis: data.content[0].text });
  } catch (error) {
    console.error('Anthropic API error:', error);
    res.status(500).json({ error: 'Failed to fetch AI analysis' });
  }
});

server.get('/api/quote/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    const response = await yahooFinance.quote(ticker);
    res.json({
      ticker,
      price: response.regularMarketPrice,
      change: response.regularMarketChange,
      changePercent: response.regularMarketChangePercent,
      volume: response.regularMarketVolume,
    });
  } catch (error) {
    console.error('Quote fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

server.get('/api/prices/:ticker', async (req, res) => {
  const { ticker } = req.params;

  try {
    const result = await yahooFinance.chart(ticker, {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      period2: new Date(),
    });

    const prices = result.map(entry => ({
      date: entry.date.toISOString().split('T')[0],
      price: entry.close,
    }));

    res.json(prices);
  } catch (error) {
    console.error('Prices fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});