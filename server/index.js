const express = require('express');
const cors = require('cors');
const path = require('path');
const TorrentSearchApi = require('torrent-search-api');

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Enable a set of public providers for broader coverage
TorrentSearchApi.enablePublicProviders();

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Search torrents for movies, returning magnets and basic metadata
app.get('/api/search', async (req, res) => {
  const query = (req.query.q || '').toString().trim();
  if (!query) {
    return res.status(400).json({ error: 'Missing q query parameter' });
  }

  try {
    const results = await TorrentSearchApi.search(query, 'Movies', 25);
    const withMagnets = await Promise.all(
      results.map(async (r) => {
        try {
          const magnet = await TorrentSearchApi.getMagnet(r);
          return {
            title: r.title,
            magnet,
            seeds: r.seeds,
            size: r.size,
            time: r.time,
            provider: r.provider,
          };
        } catch (e) {
          return null;
        }
      })
    );

    const filtered = withMagnets.filter(Boolean).sort((a, b) => (b.seeds || 0) - (a.seeds || 0));
    res.json({ query, results: filtered });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err && err.message ? err.message : String(err) });
  }
});

// Serve React build in production
const clientBuildPath = path.resolve(__dirname, '../build');
app.use(express.static(clientBuildPath));

// Fallback to index.html for non-API routes (SPA)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});


