'use strict';

process.env.SECRET='test';

const jwt = require('jsonwebtoken');

const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

const mockRequest = supergoose.server(server);

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll( () =>{
  supergoose.startDB();
});
afterAll( () => {
  supergoose.stopDB();
});

describe('Auth Router', () => {
  
  Object.keys(users).forEach( userType => {
    
    describe(`${userType} users`, () => {
      
      let encodedToken;
      let id;
      let record = {WPM: '1', correctEntries: '2', incorrectEntries: '3'};
      
      it('can create one', () => {
        return mockRequest.post('/signup')
          .send(users[userType])
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            id = token.id;
            encodedToken = results.text;
            expect(token.id).toBeDefined();
          });
      });

      it('can signin with basic', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            var token = jwt.verify(results.text, process.env.SECRET);
            expect(token.id).toEqual(id);
          });
      });

      it('can signin with bearer', () => {
        return mockRequest.post('/signin')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            return mockRequest.post('/signin')
              .set('Authorization', 'Bearer ' + results.text)
              .then(result => {
                var token = jwt.verify(result.text, process.env.SECRET);
                expect(token.id).toEqual(id);
              });

          });
      });

      it('can signin with key', () => {
        return mockRequest.post('/key')
          .auth(users[userType].username, users[userType].password)
          .then(results => {
            return mockRequest.post('/signin')
              .set('Authorization', 'Bearer ' + results.text)
              .then(result => {
                var token = jwt.verify(result.text, process.env.SECRET);
                expect(token.id).toEqual(id);
              });

          });
      });

      it('can update database', () => {
        return mockRequest.post('/update')
          .auth(users[userType].username, users[userType].password)
          .send(record)
          .then(results => {
            expect(results.status).toBe(200);
            expect(results.body.WPM).toBe('1');
            expect(results.body.correctEntries).toBe('2');
            expect(results.body.incorrectEntries).toBe('3');
          });
        
      });

    });
    
  });
  
});