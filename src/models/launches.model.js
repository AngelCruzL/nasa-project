const axios = require('axios').default;

const launchesDB = require('./launches.mongo');
const planets = require('./planets.mongo');

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';
const DEFAULT_FLIGHT_NUMBER = 100;

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launches already loaded');
  } else {
    await populateLaunches();
  }
}

async function populateLaunches() {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
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

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap(payload => payload['customers']);

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} - ${launch.mission}`);

    await saveLaunch(launch);
  }
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
  await launchesDB.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    { upsert: true }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) throw new Error('Planet not found');

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ['NASA', 'Angel Cruz'],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({ flightNumber: launchId });
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
