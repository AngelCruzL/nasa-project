const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.routes');
const launchesRouter = require('./routes/launches/launches.routes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(planetsRouter);
app.use(launchesRouter);

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;
