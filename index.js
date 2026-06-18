import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { proxyMedia } from './proxy.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/embed.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'embed.js'));
});

app.get('/proxy', proxyMedia);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`UniplayOS running on http://localhost:${PORT}`);
});
