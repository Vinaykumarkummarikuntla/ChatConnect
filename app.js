require('dotenv').config();
const path = require('path');
const express = require('express');
http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const jwt = require('jsonwebtoken');
const User = require(`./models/signupmodel`);

const socketIO = require('socket.io');

// make sure you keep this order
const app = express();
// const server = http.createServer(app);
// const io = socketIO(server);

const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.use(cors());
// app.use(cors({
//   origin: ['http://localhost:3000']
// }));

app.use(
    '/socket.io',
    express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')),
);

// // Allow requests from localhost:3000
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   next();
// });

// const morgan = require('morgan')
const userAuthentication = require('./middleware/auth');

// const io = require('socket.io')(4000)

// Import models
messages = require('./models/chatmodel');
group = require('./models/groupmodel');

// Middleware setup
// app.use(cors({ origin: 'http://localhost:3000'}));
// app.use(helmet())
// app.use(morgan('combined', { stream: accessLogStream }))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '/public')));

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'signup.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// app.use((req, res) => {
//   console.log('url', req.url)
//   res.sendFile(path.join(__dirname, `public/pages/${req.url}`))
// })

// Require routes
const loginandsignupRouter = require('./routes/signupandlogin');
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group');
const userSearch = require('./routes/usersearch');
const userRouter = require('./routes/users');

// Use routes
app.use(loginandsignupRouter);
app.use(chatRouter);
app.use(groupRouter);
app.use(userSearch);
app.use(userRouter);

// Associations
group.hasMany(messages); // user has many forgot passwords requests
messages.belongsTo(group);

let senderUsername;
io.use(async (socket, next) => {
  try {
    const secretkey = process.env.GENERATEACCESSTOKEN;
    const token = socket.handshake.query.token;
    // console.log(token, 'token is -------------------------------->');
    // Verify the JWT token and extract user information
    const user = jwt.verify(token, secretkey);
    const foundUser = await User.findByPk(user.userId);
    senderUsername = foundUser.username;


    // Attach the user information to the socket object for future use
    // socket.user = user;
    console.log(user, 'SOCKET USERNAME', senderUsername);
    console.log('USER IS AUTHENTICATED');
    return next();
  } catch (err) {
    console.log(err);
    return next(new Error('Authentication error'));
  }
});

let recipientUsername;
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-room', (username) => {
    recipientUsername = username;
    // Get the ID of the recipient's socket
    socket.join(username.replace(' ', '-'));
    console.log(`User ${username} joined the room with ID ${socket.id}`);


    socket.on('send-chat-message', (message) => {
      console.log('message incoming');
      console.log(message);
      
      message.senderUsername = senderUsername;
      console.log(message,"after sendusername added")
      if (recipientUsername) {
        io.to(recipientUsername.replace(' ', '-')).emit('chat-message', {
          message,
        });
        console.log('message sent from the backend to frontend');
      } else {
        console.log('Recipient username is not set or invalid.');
      }
    });
  //   // Ensure we have the recipient's username before sending the message
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected');
  });
});

sequelize
// .sync({ force: true })
    .sync()
    .then((response) => {
    // console.log(response)
      server.listen(3000);
    })
    .catch((err) => {
      console.log(err);
    });
