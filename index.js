const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const app = express();

app.get('/', async (req, res) => {
  const text = req.query.text || 'Hello';
  const isGif = req.query.gif === 'true'; // ?gif=true untuk GIF

  if (!isGif) {
    // Static JPG
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF'; // Background putih
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000'; // Warna teks hitam
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    res.setHeader('Content-Type', 'image/jpeg');
    canvas.createJPEGStream().pipe(res);
  } else {
    // Animated GIF (typing effect)
    const width = 800;
    const height = 400;
    const encoder = new GIFEncoder(width, height);
    res.setHeader('Content-Type', 'image/gif');
    encoder.createReadStream().pipe(res);
    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(150);
    encoder.setQuality(10);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    for (let i = 1; i <= text.length; i++) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.slice(0, i), width / 2, height / 2);
      encoder.addFrame(ctx);
    }

    encoder.finish();
  }
});

module.exports = app;
