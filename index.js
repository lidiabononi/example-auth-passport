const express = require('express')
const exphbs = require('express-handlebars');
const session = require('express-session');

const LocalPass = require('./api/configs/passport');
const GooglePass = require('./api/configs/googleStrategy')
const User = require('./api/user/controller');

require('dotenv').config();

//Inicialização do express
const app = express();


//Carrega o sequelize e faz a sincronização com o BD
const db = require('./api/configs/sequelize');

//Esta função realiza as configurações do passport
LocalPass.configuration();

//Criação da seção
app.use(session({
    secret: process.env.SECRET,
    name: process.env.SESSION_NAME,
    cookie: { maxAge: parseInt(process.env.SESSION_TIME) },
    resave: false,
    saveUninitialized: false
})
);

//Inicializando o passport e também o modo de sessão de usuário
app.use(LocalPass.passport.initialize());
app.use(LocalPass.passport.session());

//Carrega as configs para o express trabalhar com json
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//Configuração do handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Rota raiz da aplicação
app.get('/', (req, res) => {
    res.render('login')
})

//Rota de login da aplicação
app.post('/login', LocalPass.passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/error'
}));

app.post('/login/google',
    GooglePass.authenticate('google', {
        scope:
            ['email'],
        successRedirect: '/googleok',
        failureRedirect: '/error'
    }));

app.get('/googleok', (req, res) => {
    res.send("Login deu certo!")
})

app.get('/error', (req, res) => {
    res.send("Deu ruim!")
})


//Rotas da entidade usuários
require('./api/user/routes')(app)

//Inicializa o servidor da aplicação
var server = app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000 no host " + server.address.address)
})