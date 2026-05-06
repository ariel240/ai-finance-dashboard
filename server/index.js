import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const server = express();
const PORT = 3001;

server.use(cors({ origin: 'http://localhost:5173' }));
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
        'x-api-key': process.env.VITE_ANTHROPIC_KEY,
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

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});