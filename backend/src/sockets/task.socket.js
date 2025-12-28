
const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', socket => {
    console.log('Socket connected');
  });
  server.on('request', (req, res) => {
    req.io = io;
  });
};
