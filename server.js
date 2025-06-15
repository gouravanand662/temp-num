const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const API_KEY = '7601e8a098d24ba78f539391793898fd';
const API_URL = 'https://api.temp-number.org/request/handler_api.php';

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

app.listen(3000, () => console.log('Server running on http://localhost:3000'));