const httpStatus = require('http-status')
const User = require("./model")
const bcrypt = require('bcrypt');
const passport = require('passport');
const { username } = require('../configs/dbconfig');

exports.create = async (req, res) => {

    try {

        let pass = await bcrypt.hash(req.body.pass, 10);
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            login: req.body.login,
            password: pass
        });
        res.send(user);
    } catch (err) {
        console.log(err);
        res.status(httpStatus.BAD_REQUEST);
        res.send("Dados informados inválidos.")

    }
}

exports.login = async (req, res) => {

    try {

        let user = await User.findOne({
            where: { login: req.body.login }
        });

        if (user) {
            bcrypt.compare(req.body.password, user.password, function (err, result) {
                if (result) {

                    req.session.user = user.id //insere o id do usuário na sessão
                    res.json(user);

                } else {
                    res.status(httpStatus.UNAUTHORIZED);
                    res.send("Usuário e/ou senha inválidos");
                }
            });
        } else {
            res.status(httpStatus.UNAUTHORIZED);
            res.send("Usuário e/ou senha inválidos");
        }

    } catch (err) {

    }

}

exports.findAll = async (req, res) => {
    try {
        let users = await User.findAll();
        res.send(users);
    } catch (err) {
        res.status(err.status).end(err.message);
    }
}

exports.findUser = async (username) => {
    try {
        let user = await User.findOne({
            where: { login: username }
        });
        return user;
    } catch (err) {
        console.log(err.message);
    }
    return null;
}

exports.validPassword = (password, user) => {

    return bcrypt.compareSync(password, user.password);
}

exports.findById = async (id) => {

    return User.findByPk(id);
}
