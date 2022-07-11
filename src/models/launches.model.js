const axios = require('axios').default;

const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';
const DEFAULT_FLIGHT_NUMBER = 100;

async function loadLaunchesData() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
}

async function getAllLaunches() {
  return await launchesDB.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  );
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort('-flightNumber');
  return latestLaunch ? latestLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) throw new Error('Planet not found');

  await launchesDB.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['NASA', 'Angel Cruz'],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
  return await launchesDB.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    { flightNumber: launchId },
    {
      upcoming: false,
      success: false,
    }
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
