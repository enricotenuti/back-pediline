const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/lines', () => {

    let lineSpy;
    let lineSpyFindById;

    beforeAll(() => {
        const Line = require('./models/line');

        lineSpy = jest.spyOn(Line, 'find').mockImplementation(() => {
            return {
              map: jest.fn().mockResolvedValue([
                {
                    self: '/api/v1/lines/1',
                    id: 1,
                    name: 'Lista 1',
                    //students: ['student 1'],
                    color: '#000000',
                    stops: ['stop 1'],
                    schoolId: 'school 1'
                },
              ]),
            };
        });
          
        lineSpyFindById = jest.spyOn(Line, 'findById').mockImplementation((id) => {
            if (id == 1)
              return {
                self: '/api/v1/lines/1',
                id: 1,
                name: 'Lista 1',
                //students: ['student 1'],
                color: '#000000',
                stops: ['stop 1'],
                schoolId: 'school 1'
              };
        });  

    });

    afterAll(async () => {
        lineSpy.mockRestore();
        lineSpyFindById.mockRestore();
    });


    test('GET /api/v1/lines should respond with an array of lines', async () => {
        await request(app)
          .get('/api/v1/lines/')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            if (res.body && res.body[0]) {
              expect(res.body[0]).toEqual({
                self: '/api/v1/lines/1',
                id: 1,
                name: 'Lista 1',
                //students: ['student 1'],
                color: '#000000',
                stops: ['stop 1'],
                schoolId: 'school 1'
              });
            }
          });
      });

    test('GET /api/v1/lines/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/lines/2')
        .expect(404);
    });

    test('GET /api/v1/lines/:id should respond with json', async () => {
        await request(app)
          .get('/api/v1/lines/1')
          .expect('Content-Type', /json/)
          .expect(200, {
            self: '/api/v1/lines/1',
            id: 1,
            name: 'Lista 1',
            //students: ['student 1'],
            color: '#000000',
            stops: ['stop 1'],
            schoolId: 'school 1'
        });
    });

});


describe('DELETE /api/v1/lines/:id', () => {
    let lineSpyFindById2;
  
    beforeAll(() => {
  
      const line = require('./models/line');
      lineSpyFindById2 = jest.spyOn(line, 'findById').mockImplementation((id) => {
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
      lineSpyFindById2.mockRestore();
    });
  
    test('DELETE /api/v1/lines/:id should respond with 204 if line is deleted', async () => {
      await request(app)
        .delete('/api/v1/lines/1')
        .expect(204)
        .then((res) => {
          expect(res.text).toBe('');
        });
    });
  
    test('DELETE /api/v1/lines/:id should respond with 404 if line is not found', async () => {
      await request(app)
        .delete('/api/v1/lines/2')
        .expect(404, 'line not found');
    });
  });