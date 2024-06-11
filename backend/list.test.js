const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/lists', () => {

    let listSpy;
    let listSpyFindById;

    beforeAll(() => {
        const List = require('./models/list');

        listSpy = jest.spyOn(List, 'find').mockImplementation(() => {
            return {
              map: jest.fn().mockResolvedValue([
                {
                  self: '/api/v1/lists/60c72b2f9b1e8b6a1c8d912c',
                  id: '60c72b2f9b1e8b6a1c8d912c',
                  day: '2021-06-14',
                  leaders: ['60c72b2f9b1e8b6a1c8d912c'],
                  studentsPresent: ['60c72b2f9b1e8b6a1c8d912c'],
                  studentsAbsent: ['60c72b2f9b1e8b6a1c8d912c'],
                },
              ]),
            };
        });
          
        listSpyFindById = jest.spyOn(List, 'findById').mockImplementation((id) => {
            if (id == 1)
              return {
                self: '/api/v1/lists/'+id,
                id: 1,
                day: '2021-06-14',
                leaders: ['60c72b2f9b1e8b6a1c8d912c'],
                studentsPresent: ['60c72b2f9b1e8b6a1c8d912c'],
                studentsAbsent: ['60c72b2f9b1e8b6a1c8d912c'],
              };
        });  

    });

    afterAll(async () => {
        listSpy.mockRestore();
        listSpyFindById.mockRestore();
    });


    test('GET /api/v1/lists should respond with an array of lists', async () => {
        await request(app)
          .get('/api/v1/lists/')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            if (res.body && res.body[0]) {
              expect(res.body[0]).toEqual({
                self: '/api/v1/lists/60c72b2f9b1e8b6a1c8d912c',
                id: '60c72b2f9b1e8b6a1c8d912c',
                day: '2021-06-14',
                leaders: ['60c72b2f9b1e8b6a1c8d912c'],
                studentsPresent: ['60c72b2f9b1e8b6a1c8d912c'],
                studentsAbsent: ['60c72b2f9b1e8b6a1c8d912c']
              });
            }
          });
      });

    test('GET /api/v1/lists/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/lists/2')
        .expect(404);
    });

    test('GET /api/v1/lists/:id should respond with json', async () => {
        await request(app)
          .get('/api/v1/lists/1')
          .expect('Content-Type', /json/)
          .expect(200, {
            self: '/api/v1/lists/1',            
            id: 1,
            day: '2021-06-14',
            leaders: ['60c72b2f9b1e8b6a1c8d912c'],
            studentsPresent: ['60c72b2f9b1e8b6a1c8d912c'],
            studentsAbsent: ['60c72b2f9b1e8b6a1c8d912c'],
        });
    });

});


describe('DELETE /api/v1/lists/:id', () => {
    let listSpyFindById2;
  
    beforeAll(() => {
  
      const List = require('./models/list');
      listSpyFindById2 = jest.spyOn(List, 'findById').mockImplementation((id) => {
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
      listSpyFindById2.mockRestore();
    });
  
    test('DELETE /api/v1/lists/:id should respond with 204 if line is deleted', async () => {
      await request(app)
        .delete('/api/v1/lists/1')
        .expect(204)
        .then((res) => {
          expect(res.text).toBe('');
        });
    });
  
    test('DELETE /api/v1/lists/:id should respond with 404 if line is not found', async () => {
      await request(app)
        .delete('/api/v1/lists/2')
        .expect(404, 'List not found');
    });
  });