const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/alerts', () => {

    let alertSpy;
    let alertSpyFindById;

    beforeAll(() => {
        const Alert = require('./models/alert');

        alertSpy = jest.spyOn(Alert, 'find').mockImplementation(() => {
            return {
              map: jest.fn().mockResolvedValue([
                {
                    self: '/api/v1/alerts/',
                    title: 'title1',
                    description: 'description1',
                    date: '11-11-2021',
                    author: 'author1'
                },
              ]),
            };
        });
          
        alertSpyFindById = jest.spyOn(Alert, 'findById').mockImplementation((id) => {
            if (id == 1)
              return {
                self: '/api/v1/alerts/'+id,
                id: 1,
                title: 'title1',
                description: 'description1',
                date: '11-11-2021',
                author: 'author1'
              };
        });  

    });

    afterAll(async () => {
        alertSpy.mockRestore();
        alertSpyFindById.mockRestore();
    });


    test('GET /api/v1/alerts should respond with an array of alerts', async () => {
        await request(app)
          .get('/api/v1/alerts/')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            if (res.body && res.body[0]) {
              expect(res.body[0]).toEqual({
                self: '/api/v1/alerts/1',
                id: 1,
                title: 'title1',
                description: 'description1',
                date: '11-11-2021',
                author: 'author1'
              });
            }
          });
      });

    test('GET /api/v1/alerts/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/alerts/2')
        .expect(404);
    });

    test('GET /api/v1/alerts/:id should respond with json', async () => {
        await request(app)
          .get('/api/v1/alerts/1')
          .expect('Content-Type', /json/)
          .expect(200, {
            self: '/api/v1/alerts/1',       // TODO da sistemare
            id: 1,
            title: 'title1',
            description: 'description1',
            date: '11-11-2021',
            author: 'author1'
        });
    });

});


describe('DELETE /api/v1/alerts/:id', () => {
    let alertSpyFindById2;
  
    beforeAll(() => {
  
      const alert = require('./models/alert');
      alertSpyFindById2 = jest.spyOn(alert, 'findById').mockImplementation((id) => {
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
      alertSpyFindById2.mockRestore();
    });
  
    test('DELETE /api/v1/alerts/:id should respond with 204 if line is deleted', async () => {
      await request(app)
        .delete('/api/v1/alerts/1')
        .expect(204)
        .then((res) => {
          expect(res.text).toBe('');
        });
    });
  
    test('DELETE /api/v1/alerts/:id should respond with 404 if line is not found', async () => {
      await request(app)
        .delete('/api/v1/alerts/2')
        .expect(404, 'Alert not found');
    });
  });