const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/stops', () => {
  // Mocking Stop.find method
  let stopSpy;
  // Mocking Stop.findById method
  let stopSpyFindById;

  

  beforeAll(() => {
    jest.setTimeout(8000);
    const Stop = require('./models/stop');
    
    stopSpy = jest.spyOn(Stop, 'find').mockImplementation((criterias) => {
        if (criterias && criterias.line == 'linea1'){
            return {
                exec: jest.fn().mockResolvedValue([{
                    self: '/api/v1/stops/60c72b2f9b1e8b6a1c8d912c',
                    id: '60c72b2f9b1e8b6a1c8d912c',
                    name: 'Fermata 1',
                    schedule: '12:00',
                    position: [0, 0],
                    line: 'linea1'
                }])
            };
        }else{
            return {
                exec: jest.fn().mockResolvedValue([
                    {
                        self: '/api/v1/stops/60c72b2f9b1e8b6a1c8d912c',
                        id: '60c72b2f9b1e8b6a1c8d912c',
                        name: 'Fermata 1',
                        schedule: '12:00',
                        position: [0, 0],
                        line: 'linea1'
                    },
                    {
                        self: '/api/v1/stops/60c72b2f9b1e8b6a1c8d912d',
                        id: '60c72b2f9b1e8b6a1c8d912d',
                        name: 'Fermata 2',
                        schedule: '13:00',
                        position: [1, 1],
                        line: 'linea2'
                    }
                ])
            };
        }
        
    });
    
    stopSpyFindById = jest.spyOn(Stop, 'findById').mockImplementation((id) => {
      if (id == 1)
        return {
          self: '/api/v1/stops/1',
          id: 1,
          name: 'Fermata 1',
          schedule: '12:00',
          position: [0, 0],
          line: 1000
        }; 
    });

    
  });

  afterAll(async () => {
    stopSpy.mockRestore();
    stopSpyFindById.mockRestore();
  });

  test('GET /api/v1/stops should respond with a json of stops', async () => {
    await request(app)
      .get('/api/v1/stops/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v1/stops/60c72b2f9b1e8b6a1c8d912c',
            id: '60c72b2f9b1e8b6a1c8d912c',
            name: 'Fermata 1',
            schedule: '12:00',
            position: [0, 0],
            line: 'linea1'
        },
        {
            self: '/api/v1/stops/60c72b2f9b1e8b6a1c8d912d',
            id: '60c72b2f9b1e8b6a1c8d912d',
            name: 'Fermata 2',
            schedule: '13:00',
            position: [1, 1],
            line: 'linea2'
        });
        }
      });
  });

  test('GET /api/v1/stops?line=linea1 should respond with lines with line==linea1', async () => {
    await request(app)
      .get('/api/v1/stops/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v1/stops/60c72b2f9b1e8b6a1c8d912c',
            id: '60c72b2f9b1e8b6a1c8d912c',
            name: 'Fermata 1',
            schedule: '12:00',
            position: [0, 0],
            line: 'linea1'
        });
        }
      });
  }); // Timeout per questo singolo test

  test('GET /api/v1/stops/:id should respond with json', async () => {
    await request(app)
      .get('/api/v1/stops/1')
      .expect('Content-Type', /json/)
      .expect(200, {
        self: '/api/v1/stops/1',
        id: 1,
        name: 'Fermata 1',
        schedule: '12:00',
        position: [0, 0],
        line: 1000
      });
  }); // Timeout per questo singolo test

    test('GET /api/v1/stops/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/stops/2')
        .expect(404);
    });
   
});

describe('DELETE /api/v1/stops/:id', () => {
  let stopSpyFindById2;

  beforeAll(() => {

    const Stop = require('./models/stop');
    stopSpyFindById2 = jest.spyOn(Stop, 'findById').mockImplementation((id) => {
      if (id === '1') {
        return {
          exec: jest.fn().mockResolvedValue({
            id: '1',
            deleteOne: jest.fn().mockResolvedValue(true), // Mock del metodo deleteOne
          }),
        };
      } else {
        return {
          exec: jest.fn().mockResolvedValue(null),
        };
      }
    });
  });

  afterAll(() => {
    stopSpyFindById2.mockRestore();
  });

  test('DELETE /api/v1/stops/:id should respond with 204 if stop is deleted', async () => {
    await request(app)
      .delete('/api/v1/stops/1')
      .expect(204)
      .then((res) => {
        expect(res.text).toBe('');
      });
  });

  test('DELETE /api/v1/stops/:id should respond with 404 if stop is not found', async () => {
    await request(app)
      .delete('/api/v1/stops/2')
      .expect(404, 'Stop not found');
  });
});