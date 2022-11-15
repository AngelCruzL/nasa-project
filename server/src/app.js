const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiV1 = require('./routes/api.v1');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/v1', apiV1);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
