const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/calendars', () => {

    let calendarSpy;
    let calendarSpyFindById;

    beforeAll(() => {
        const Calendar = require('./models/calendar');

        calendarSpy = jest.spyOn(Calendar, 'find').mockImplementation(() => {
            return {
              map: jest.fn().mockResolvedValue([
                {
                    self: '/api/v1/calendars/1',
                    listePresenze: '60c72b2f9b1e8b6a1c8d912c',
                    bacheca: 'bacheca1'
                },
              ]),
            };
        });
          
        calendarSpyFindById = jest.spyOn(Calendar, 'findById').mockImplementation((id) => {
            if (id == 1)
              return {
                    self: '/api/v1/calendars/'+id,
                    id: 1,    
                    listePresenze: '60c72b2f9b1e8b6a1c8d912c',
                    bacheca: 'bacheca1'
              };
        });  

    });

    afterAll(async () => {
        calendarSpy.mockRestore();
        calendarSpyFindById.mockRestore();
    });


    test('GET /api/v1/calendars should respond with an array of calendars', async () => {
        await request(app)
          .get('/api/v1/calendars/')
          .expect('Content-Type', /json/)
          .expect(200)
          .then((res) => {
            if (res.body && res.body[0]) {
              expect(res.body[0]).toEqual({
                self: '/api/v1/calendars/1',
                listePresenze: '60c72b2f9b1e8b6a1c8d912c',
                bacheca: 'bacheca1'
              });
            }
          });
      });

    test('GET /api/v1/calendars/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/calendars/2')
        .expect(404);
    });

    test('GET /api/v1/calendars/:id should respond with json', async () => {
        await request(app)
          .get('/api/v1/calendars/1')
          .expect('Content-Type', /json/)
          .expect(200, {
            self: '/api/v1/calendars/1', 
            id: 1,
            listePresenze: '60c72b2f9b1e8b6a1c8d912c',
            bacheca: 'bacheca1'
        });
    });

});


describe('DELETE /api/v1/calendars/:id', () => {
    let calendarSpyFindById2;
  
    beforeAll(() => {
  
      const calendar = require('./models/calendar');
      calendarSpyFindById2 = jest.spyOn(calendar, 'findById').mockImplementation((id) => {
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
      calendarSpyFindById2.mockRestore();
    });
  
    test('DELETE /api/v1/calendars/:id should respond with 204 if line is deleted', async () => {
      await request(app)
        .delete('/api/v1/calendars/1')
        .expect(204)
        .then((res) => {
          expect(res.text).toBe('');
        });
    });
  
    test('DELETE /api/v1/calendars/:id should respond with 404 if line is not found', async () => {
      await request(app)
        .delete('/api/v1/calendars/2')
        .expect(404, 'Calendar not found');
    });
  });