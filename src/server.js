const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const MemoryFS = require('memory-fs');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3005;
const fs = new MemoryFS();

app.use(cors());
app.use(express.json());

app.post('/convert-magnet', (req, res) => {
  const magnet = req.body.magnet;

  if (!magnet) {
    return res.status(400).json({ error: 'Magnet link is required' });
  }

  const engine = torrentStream(magnet);

  engine.on('ready', () => {
    const file = engine.files.find((file) => file.name.endsWith('.mp4'));

    if (!file) {
      return res.status(400).json({ error: 'No suitable video file found' });
    }

    const outputPath = '/output.m3u8';

    ffmpeg(file.createReadStream())
      .videoCodec('libx264')
      .audioCodec('aac')
      .format('hls')
      .output(fs.createWriteStream(outputPath))
      .on('end', () => {
        engine.destroy();
      })
      .run();

    res.json({ hlsStreamUrl: '/output.m3u8' });
  });
});

app.get('/output.m3u8', (req, res) => {
  const outputPath = '/output.m3u8';

  if (!fs.existsSync(outputPath)) {
    return res.status(404).send('File not found');
  }

  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.send(fs.readFileSync(outputPath));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
