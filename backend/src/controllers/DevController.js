const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

//Controller Functions: index, show, store, update, destroy

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, longitude, latitude } = request.body;
    
        let dev = await Dev.findOne( { github_username });

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                name,
                github_username,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            //Filtrar as conexões que estão a no máximo 10KM de distância e que o novo DEV
            //tenha ao menos 1 das tecnologias filtradas.
            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );

            //console.log(sendSocketMessageTo);
            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        };
    
        return response.json(dev);
    },

    async update(request, response) {
        const { github_username } = request.query;
        const { name, avatar_url, bio, techs, longitude, latitude } = request.body;

        const techsArray = parseStringAsArray(techs);
        
        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };
        
        let dev = await Dev.findOne( { github_username } );
        if (dev) {
            dev.name = name != null ? name : dev.name,
            dev.avatar_url = avatar_url != null ? avatar_url : dev.avatar_url,
            dev.bio = bio != null ? bio : dev.bio,
            dev.techs = techsArray != null ? techsArray : dev.techs,
            dev.location = location != null ? location : dev.location;

            const dbRet = await Dev.update(dev);
            
            return response.json(dev);
        } else {
            return response.status(404).json({ message: 'Não foi encontrado registro para alteração.' });
        };
    },

    async destroy(request, response) {
        const { github_username } = request.query;

        let dev = await Dev.findOne( { github_username } );
        if (dev) {
            //Dev.deleteOne(dev);
            return response.json({});
        } else {
            return response.status(404).json({ message: 'Não foi encontrado registro para deleção.' });
        };
    },
};