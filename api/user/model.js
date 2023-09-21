const db = require("./../configs/sequelize")
const { Model, DataTypes } = db.Sequelize

const sequelize = db.sequelize

class User extends Model { }
User.init({
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    login: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false

    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "users" })

module.exports = User