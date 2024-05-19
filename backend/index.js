require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());

// routes
app.use('/api', userRoutes);
app.use('/api', chatRoutes);
app.use('/api', messageRoutes);

db.connect();

// server
const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    orgin: 'http://localhost:5173'
  }
})

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected')
  });

  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('User joined the room');
  });

  socket.on('new message', (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user => {
      if(user._id == newMessageRecieved.sender._id){
        return ;
      }
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});