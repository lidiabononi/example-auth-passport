module.exports = (app) => {

    const controller = require('./controller')

    //Criar um novo perfil de usuário
    app.post('/user', controller.create)

    //Busca todos os perfis de usuário
    app.get('/user', controller.findAll)

}