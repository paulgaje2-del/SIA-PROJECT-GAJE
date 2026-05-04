const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); 

let recommendations = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', genre: 'pop' },
  { id: 2, title: 'Levitating', artist: 'Dua Lipa', genre: 'pop' },
  { id: 3, title: 'Lose Yourself', artist: 'Eminem', genre: 'rap' },
  { id: 4, title: 'SICKO MODE', artist: 'Travis Scott', genre: 'rap' },
  { id: 5, title: 'Shape of You', artist: 'Ed Sheeran', genre: 'pop' },
  { id: 6, title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'rock' },
  { id: 7, title: 'Stairway to Heaven', artist: 'Led Zeppelin', genre: 'rock' },
  { id: 8, title: 'Watermelon Sugar', artist: 'Harry Styles', genre: 'pop' },
  { id: 9, title: 'drivers license', artist: 'Olivia Rodrigo', genre: 'pop' },
  { id: 10, title: 'Smells Like Teen Spirit', artist: 'Nirvana', genre: 'rock' }
];

app.get('/', (req, res) => {
  res.json({
    message: 'Music Recommendation API is running.',
    endpoints: [
      { path: '/recommendations', description: 'List all recommendations or filter by genre using ?genre=pop' },
      { path: '/recommendations/:id', description: 'Get one recommendation by id' },
      { path: '/recommendations', description: 'Create a new recommendation (POST)' },
      { path: '/recommendations/:id', description: 'Update a recommendation (PUT)' },
      { path: '/recommendations/:id', description: 'Delete a recommendation (DELETE)' },
      { path: '/health', description: 'Health check endpoint' }
    ]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/recommendations', (req, res) => {
  const genre = (req.query.genre || '').toLowerCase();
  if (genre) {
    const filtered = recommendations.filter(item => item.genre === genre);
    return res.json({ genre, count: filtered.length, recommendations: filtered });
  }
  res.json({ count: recommendations.length, recommendations });
});

app.get('/recommendations/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = recommendations.find(r => r.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }
  res.json(item);
});

app.post('/recommendations', (req, res) => {
  const { title, artist, genre } = req.body;
  if (!title || !artist || !genre) {
    return res.status(400).json({ error: 'Title, artist, and genre are required' });
  }

  const newId = recommendations.length ? recommendations[recommendations.length - 1].id + 1 : 1;
  const newRecommendation = { id: newId, title, artist, genre };
  recommendations.push(newRecommendation);

  res.status(201).json(newRecommendation);
});

app.put('/recommendations/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, artist, genre } = req.body;

  if (!title || !artist || !genre) {
    return res.status(400).json({ error: 'Title, artist, and genre are required' });
  }

  const index = recommendations.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }

  recommendations[index] = { id, title, artist, genre };
  res.json(recommendations[index]);
});

app.delete('/recommendations/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = recommendations.findIndex(r => r.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Recommendation not found' });
  }

  recommendations.splice(index, 1);
  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Music Recommendation API listening on port ${port}`);
});