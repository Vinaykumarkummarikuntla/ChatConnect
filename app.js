/* eslint-disable max-len */
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
const server = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(server);

app.use(cors());

app.use(
    '/socket.io',
    express.static(path.join(__dirname, 'node_modules/socket.io/client-dist')),
);


const userAuthentication = require('./middleware/auth');

// Import models
messages = require('./models/chatmodel');
group = require('./models/groupmodel');

// Middleware setup
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


const activeUsers = [];
let authenticatedUsername;
io.use(async (socket, next) => {
  try {
    const secretkey = process.env.GENERATEACCESSTOKEN;
    const token = socket.handshake.query.token;
    // console.log(token, 'token is -------------------------------->');
    // Verify the JWT token and extract user information
    const user = jwt.verify(token, secretkey);
    const foundUser = await User.findByPk(user.userId);
    authenticatedUsername = foundUser.username;

    if (authenticatedUsername) {
      activeUsers.push({username: authenticatedUsername, socketId: socket.id});
    }

    // Attach the user information to the socket object for future use
    // socket.user = user;
    console.log(user, 'SOCKET USERNAME', authenticatedUsername);
    console.log('ACTIE USERE ARE', activeUsers);
    return next();
  } catch (err) {
    console.log(err);
    return next(new Error('Authentication error'));
  }
});

let recipientUsername;
io.on('connection', (socket) => {
  console.log('a user connected');

  // PERSON TO PERSON MESSAGE
  socket.on('send-chat-message', (chatDetails) => {
    const {recipientUsername, msg, formattedTime} = chatDetails;
    console.log('Received chat message:', chatDetails);
    const recipientUser = activeUsers.find((user) => user.username === recipientUsername);
    if (recipientUser) {
      const recipientSocketId = recipientUser.socketId;
      const recipientSocketName = recipientUser.username;

      // Send the message to the recipient using their socket ID.
      io.to(recipientSocketId).emit('chat-message', chatDetails);
      console.log(`Sent message to ${recipientSocketName} with socket ID ${recipientSocketId}`);
    } else {
      console.log(`Recipient ${recipientSocketName} not found in active users.`);
    }
  });

  // GROUP MESSAGES
  let activeGroupMembers = null;
  socket.on('send-group-message', (groupMessage) => {
    const {msg, selectedGroup, groupMembers, formattedTime} = groupMessage;
    console.log('Received group message:', groupMessage);

    // Filter active group members from the groupMembers array
    activeGroupMembers = groupMembers.map((memberUsername) =>
      activeUsers.find((user) => user.username === memberUsername),
    );
    console.log(activeGroupMembers, 'active group memebers');
    // Loop through active group members and send the group message to each member
    activeGroupMembers.forEach((member) => {
      const recipientSocketId = member.socketId;
      // Send the group message to the recipient using their socket ID.

      io.to(recipientSocketId).emit('group-chat-message', groupMessage );
      console.log(`Sent group message to ${member.username} with socket ID ${recipientSocketId}`);
    });
  });

  socket.on('disconnect', () => {
    const index = activeUsers.indexOf(authenticatedUsername);
    if (index !== -1) {
      activeUsers.splice(index, 1);
      console.log('User disconnected. Removed from activeUsers:', authenticatedUsername);
    }
  });
});

sequelize
// .sync({ force: true })
    .sync()
    .then((response) => {
      server.listen(3000);
    })
    .catch((err) => {
      console.log(err);
    });
