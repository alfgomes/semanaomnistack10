const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

// Métodos HTTP: GET, POST, PUT, DELETE

// Tipos de Parâmetros:
//   Query Params: request.query (Filtros, ordenação, paginação, ...)
//   Route Params: request.params (Identificar um recurso na alteração ou remoção)
//   Body        : request.body (Dados para criação ou alteração de um registro)

// MongoDB (Não-relacional)
// Criando base de dados para testes: https://cloud.mongodb.com
// Testando se rede permite acesso ao MongoDB: http://portquiz.net:27017/

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;