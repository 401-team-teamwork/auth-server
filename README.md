#SuperType: Revolution

#### Overview

'SuperType: Revolution' is a multiplayer typing game/keyboard layout trainer for anyone interested
in learning switching from a standard 'QWERTY' keyboard layout to 'dvorak' or 'colemak'.

#### Table of Contents
* [installation and usage](#installation-and-usage)
* [API](#API)
* [architecture](#Architecture)
* [auth-server](#auth-server)
* [client-application](#client-application)
* [socket-server](#socket-server)
* [testing](#testing)

---
###Installation and Usage

```
$ npm install super-type-revolution
$ npm install

$ npm run start
```

###API

At face value 'SuperType: Revolution' is a simple typing game, with a backend API that gives us
the ability to 'create' and 'update' users, passwords, and game stats 
provided by playing the game. 

Information is provided by the players at the start of the game. The information will either
create a new username and password, or log you into the game with a previously made username and
password combo. 

The game is played by first picking your keyboard layout. If there are two players, they will
both be provided a randomly generated string to type out, using their selected layout.

Under the hood, while the game is played, each key stroke is logged to calculate stats for each
user in our database. 

###Architecture
This API is run on an event driven Node.js server, using socket.io, express middleware and mongoDB.
Deployment made possible by Heroku.

* socket.io to handle the connections and events between client and server.
* express for basic routing capabilities, and error handling.
* jsonwebtoken and bcrypt for authentication of users.
* mongoose for database interaction.

The API is built using 3 different modules: auth-server, client-application and socket-server.


---
---
##auth-server
* [UML](assets/uml.png)
* [travis](https://travis-ci.com/yosh-401-advanced-javascript/lab-00.svg?branch=master)
### Modules
```
    src
      auth
        * middleware.js
        * router.js
        * users.model.js
      middlware
        * 404.js
        * error.js
      * app.js
* .env
* index.js
```
    


##### Exported Values and Methods

* `req, res, next -> router.js(auth)`
* `authRouter(express.Router) -> app.js(authRouter)`
* `mongoose.model('users', users); -> router.js(User)`

### Setup
#### `.env` requirements
* `PORT` - 3000
* `MONGODB_URI` - mongodb://localhost:27017/midterm
* `SECRET` - testSecret


##client-application
* [UML](assets/uml.png)
* [travis](https://travis-ci.com/yosh-401-advanced-javascript/lab-00.svg?branch=master)
### Modules
```
    src
      * gameSocket.js
      * gameView.js
      * userPrompts.js
  * .env
```

##### Exported Values and Methods
* `user(function) -> gameView.js(user)`
* `gameView(class) -> gameSocket.js(gameView) `
* `initialUserPrompts(function) -> gameSocket.js(initialUserPrompts)`
* `welcome(function) -> gameSocket.js(welcome)`

### Setup
#### `.env` requirements
* `SOCKET_URL` - http://localhost:8080


##socket-server
* [UML](assets/uml.png)
* [travis](https://travis-ci.com/yosh-401-advanced-javascript/lab-00.svg?branch=master)
### Modules
```
    src
      * gameModel.js
  * .env
  * server.js
  * words.txt
```
##### Exported Values and Methods

`Game(class) -> server.js(Game)`

### Setup
#### `.env` requirements
* `PORT` - 8080

---
---
####Testing
Linting script:

`$ npm run lint`

Testing script:
`$ npm run test`
















