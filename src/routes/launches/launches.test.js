const request = require('supertest');
const app = require('../../app');
const { dbConnection, dbDisconnection } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await dbConnection();
  });

  afterAll(async () => {
    await dbDisconnection();
  });

  describe('Test GET /launches', () => {
    test('should respond with status 200 success', async () => {
      const response = await request(app)
        .get('/api/v1/launches')
        .expect(200)
        .expect('Content-Type', /json/);
      // expect(response.statusCode).toBe(200);
    });
  });

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-62 f',
      launchDate: 'April 15,2025',
    };

    const launchDataWithoutDate = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-62 f',
    };

    const launchDataWithInvalidDate = {
      mission: 'Test Mission',
      rocket: 'Test Rocket',
      target: 'Kepler-62 f',
      launchDate: 'not valid date',
    };

    test('should respond with status 201 created', async () => {
      const response = await request(app)
        .post('/api/v1/launches')
        .send(completeLaunchData)
        .expect(201)
        .expect('Content-Type', /json/);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('should catch missing required properties', async () => {
      const response = await request(app)
        .post('/api/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Missing required fields',
      });
    });

    test('should catch invalid dates', async () => {
      const response = await request(app)
        .post('/api/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
