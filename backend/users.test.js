const request = require('supertest');
const app = require('./server.js');

describe('GET /api/v1/users', () => {
  // Mocking User.find method
  let userSpy;
  // Mocking User.findById method
  let userSpyFindById;

  

  beforeAll(() => {
    jest.setTimeout(8000);
    const User = require('./models/user');
    
    userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
        if (criterias && criterias.email == 'alice@user.com'){
            return {
              exec: jest.fn().mockResolvedValue([{
                    self: "/api/v1/users/1",
                    id: 1,           
                    email: 'alice@user.com',
                    role: 'user',
                    school: 'school1',
                    line: 'linea1',
                    stop: 'fermata1'
              }])
            };
        }else{
            return {
                exec: jest.fn().mockResolvedValue([
                    {
                        self: "/api/v1/users/1",
                        id: 1,       
                        email: 'alice@user.com',
                        role: 'user',
                        school: 'school1',
                        line: 'linea1',
                        stop: 'fermata1'
                    },
                    {
                        self: '/api/v1/users/2',
                        id: 2,        
                        email: 'bob@user.com',
                        role: 'user',
                        school: 'school2',
                        line: 'linea2',
                        stop: 'fermata2'
                    }
                ])
            };
        }
        
    });
    
    userSpyFindById = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id == 'u1')
        return {
            self: '/api/v1/users/'+id,
            id: 'u1',
            email: 'alice@user.com',
            role: 'user',
            school: 'school1',
            line: 'linea1',
            stop: 'fermata1'
        }; 
    });

    
  });

  afterAll(async () => {
    userSpy.mockRestore();
    userSpyFindById.mockRestore();
  });

  test('GET /api/v1/users should respond with a json of users', async () => {
    await request(app)
      .get('/api/v1/users/')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: "/api/v1/users/"+"1",
            id: 1,        
            email: 'alice@user.com',
            role: 'user',
            school: 'school1',
            line: 'linea1',
            stop: 'fermata1'
        },
        {
            self: "/api/v1/users/2",
            id: 2,        
            email: 'bob@user.com',
            role: 'user',
            school: 'school2',
            line: 'linea2',
            stop: 'fermata2'
        });
        }
      });
  });

  test('GET /api/v1/users?email=alice@user.com should respond with lines with email=alice@user.com', async () => {
    await request(app)
      .get('/api/v1/users?email=alice@user.com')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        if (res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: "/api/v1/users/1",
            id: 1,
            email: 'alice@user.com',
            role: 'user',
            school: 'school1',
            line: 'linea1',
            stop: 'fermata1'
        });
        }
      });
  });

  test('GET /api/v1/users/:id should respond with json', async () => {
    await request(app)
      .get('/api/v1/users/u1')
      .expect('Content-Type', /json/)
      .expect(200, {
        self: '/api/v1/users/u1',
        id: 'u1',           
        email: 'alice@user.com',
        role: 'user',
        school: 'school1',
        line: 'linea1',
        stop: 'fermata1'
      });
  });

    test('GET /api/v1/users/:id should respond with 404 if id not found', async () => {
        await request(app)
        .get('/api/v1/users/2')
        .expect(404);
    });
   
});

describe('DELETE /api/v1/users/:id', () => {
  let userSpyFindById2;

  beforeAll(() => {

    const User = require('./models/user');
    userSpyFindById2 = jest.spyOn(User, 'findById').mockImplementation((id) => {
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
    userSpyFindById2.mockRestore();
  });

  test('DELETE /api/v1/users/:id should respond with 204 if user is deleted', async () => {
    await request(app)
      .delete('/api/v1/users/1')
      .expect(204)
      .then((res) => {
        expect(res.text).toBe('');
      });
  });

  test('DELETE /api/v1/users/:id should respond with 404 if user is not found', async () => {
    await request(app)
      .delete('/api/v1/users/2')
      .expect(404, 'User not found');
  });
});