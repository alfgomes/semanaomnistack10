const socketio = require('socket.io');

const parseStringAsArray = require('../src/utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
//TO-DO: Alterar esse Array para um Banco de Dados...
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        // setTimeout(() => {
        //     socket.emit('message', 'Hello OmniStack');
        // }, 3000);

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item));
    });
};

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connections.id).emit(message, data);
    });
};