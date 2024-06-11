const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/schools', () => {

    let schoolSpy;
    let schoolSpyFindById;

    beforeAll(() => {
        const School = require('./models/school');

        schoolSpy = jest.spyOn(School, 'find').mockImplementation(() => {
            return {
              sort: jest.fn().mockReturnThis(),
              map: jest.fn().mockResolvedValue([
                {
                    self: '/api/v1/schools/school1',
                    id: '1',
                    name: 'name1',
                    linesId: ['line1', 'line2'],
                    position: [0, 0]
                },
              ]),
            };
        });
          
        schoolSpyFindById = jest.spyOn(School, 'findById').mockImplementation((id) => {
            if (id == 1)
              return {
                self: '/api/v1/schools/1',
                id: '1',
                name: 'name1',
                linesId: ['line1', 'line2'],
                position: [0, 0]
              };
        });  

    });

    afterAll(async () => {
        schoolSpy.mockRestore();
        schoolSpyFindById.mockRestore();
    });


    test('GET /api/v1/schools should respond with an array of schools', async () => {
        await request(app)
          .get('/api/v1/schools/')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            if (res.body && res.body[0]) {
              expect(res.body[0]).toEqual({
                self: '/api/v1/schools/school1',
                id: '1',
                name: 'name1',
                linesId: ['line1', 'line2'],
                position: [0, 0]
              });
            }
          });
      });

    test('GET /api/v1/schools/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/schools/2')
        .expect(404);
    });

    test('GET /api/v1/schools/:id should respond with json', async () => {
        await request(app)
          .get('/api/v1/schools/1')
          .expect('Content-Type', /json/)
          .expect(200, {
            self: '/api/v1/schools/1',
            id: '1',
            name: 'name1',
            linesId: ['line1', 'line2'],
            position: [0, 0]
        });
    });

});


describe('DELETE /api/v1/schools/:id', () => {
    let schoolSpyFindById2;
  
    beforeAll(() => {
  
      const school = require('./models/school');
      schoolSpyFindById2 = jest.spyOn(school, 'findById').mockImplementation((id) => {
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
      schoolSpyFindById2.mockRestore();
    });
  
    test('DELETE /api/v1/schools/:id should respond with 204 if line is deleted', async () => {
      await request(app)
        .delete('/api/v1/schools/1')
        .expect(204)
        .then((res) => {
          expect(res.text).toBe('');
        });
    });
  
    test('DELETE /api/v1/schools/:id should respond with 404 if line is not found', async () => {
      await request(app)
        .delete('/api/v1/schools/2')
        .expect(404, 'school not found');
    });
  });