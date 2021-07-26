
'use strict';

function onConnect(socket) {
    socket.on('info', function (data) {
        console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
    });

}

module.exports = (socketio) => {
    
    socketio.on('connection', function (socket) {
        
        console.log(`Socket ${socket.id} connected.`);
        socketio.on('disconnect', () => {
            console.log(`Socket ${socket.id} disconnected.`);
        });
        onConnect(socket);
    });
    global.socketConnection = socketio;
};