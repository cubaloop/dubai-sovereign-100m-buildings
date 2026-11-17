const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3092;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    project: 'Dubai Whole-Building Sovereign Mandate — €100M Tranche I (€400M Total Capacity)',
    buildings_analyzed: 55,
    raw_listings_audited: 208,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/config', (req, res) => {
  res.status(200).json({
    project: 'Dubai Whole-Building Sovereign Portfolio (€100M Tranche I)',
    totalMandateEur: 400000000,
    trancheOneEur: 100000000,
    trancheOneAed: 400000000,
    fxRateEurAed: 4.00,
    totalBuildings: 55,
    source: 'Property Finder UAE Live Extraction + Official DLD Benchmarks'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dubai Sovereign 100M Buildings Portal running on port ${PORT}`);

  // Mandatory 24/7 Wake-Lock Pulse (every 5 minutes)
  const selfUrl = process.env.RENDER_EXTERNAL_URL
    ? `${process.env.RENDER_EXTERNAL_URL}/healthz`
    : `http://127.0.0.1:${PORT}/healthz`;

  setInterval(() => {
    const client = selfUrl.startsWith('https') ? https : http;
    client.get(selfUrl, (res) => {
      res.resume();
    }).on('error', () => {});
  }, 5 * 60 * 1000);
});
