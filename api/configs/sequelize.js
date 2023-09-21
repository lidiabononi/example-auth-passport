const dbConfig = require('./dbconfig')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(dbConfig)

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.sync = async () => {
    await db.sequelize.sync({ alter: true });
    console.log("BD sincronizado!");

}

module.exports = db