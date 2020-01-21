const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const { latitude, longitude, techs } = request.query;
        
        const techsArray = parseStringAsArray(techs);
        
        //Reference: https://docs.mongodb.com/manual/reference/operator/query/
        const devs = await Dev.find({
            //Filtrar por tecnologias
            techs: {
                $in: techsArray,
            },
            //Buscar todos os devs num raio de 10Km
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                },
            },
        });

        return response.json({ devs });
    }
};