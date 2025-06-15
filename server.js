const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());

// ✅ Enable CORS for all origins (or restrict below)
app.use(cors());

// Constants
const API_KEY = '7601e8a098d24ba78f539391793898fd';
const API_URL = 'https://api.temp-number.org/request/handler_api.php';

// POST /get-number
app.post('/get-number', async (req, res) => {
  const { country, service } = req.body;
  try {
    const { data } = await axios.get(API_URL, {
      params: {
        api_key: API_KEY,
        action: 'getNumber',
        country,
        service,
      },
    });

    if (data.startsWith('ACCESS_NUMBER')) {
      const parts = data.split(':');
      res.json({
        status: 'success',
        id: parts[1],
        number: parts[2],
      });
    } else {
      res.json({ status: 'error', message: data });
    }
  } catch (e) {
    res.status(500).json({ status: 'error', message: 'API request failed' });
  }
});

// GET /check-status/:id
app.get('/check-status/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(API_URL, {
      params: {
        api_key: API_KEY,
        action: 'getStatus',
        id,
      },
    });

    res.json({ status: data });
  } catch {
    res.status(500).json({ status: 'error', message: 'Status check failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
