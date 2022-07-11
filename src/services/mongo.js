const mongoose = require('mongoose');

mongoose.connection.on('open', () => {
  console.log('Database online');
});

mongoose.connection.on('error', err => {
  console.log({ err });
});

async function dbConnection() {
  await mongoose.connect(process.env.MONGO_URL);
}

async function dbDisconnection() {
  await mongoose.disconnect();
}

module.exports = {
  dbConnection,
  dbDisconnection,
};
