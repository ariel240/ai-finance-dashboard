import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import YahooFinance from 'yahoo-finance2';

dotenv.config();

const yahooFinance = new YahooFinance();
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
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.ALPHA_VANTAGE_KEY}`
    );
    const data = await response.json();
    console.log('Alpha Vantage response:', JSON.stringify(data).slice(0, 300));
    const quote = data['Global Quote'];

    if (!quote || !quote['05. price']) {
      return res.status(400).json({ error: 'Invalid ticker or rate limit reached' });
    }

    res.json({
      ticker,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent']),
      volume: parseInt(quote['06. volume']),
    });
  } catch (error) {
    console.error('Quote fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

server.get('/api/prices/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const endDate = new Date();
  const to = new Date().toISOString().split('T')[0];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);
  const from = startDate.toISOString().split('T')[0];
  
  try {
    const response = await fetch(
      `https://api.massive.com/v2/aggs/ticker/${ticker.toUpperCase()}/range/1/day/${from}/${to}?adjusted=true&sort=asc&apiKey=${process.env.MASSIVE_KEY}`)
    
    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return res.status(400).json({ error: 'Failed to fetch historical data or invalid ticker' });
    }
    const prices = data.results.map(item => ({
      date: new Date(item.t).toISOString().split('T')[0],
      price: item.c 
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