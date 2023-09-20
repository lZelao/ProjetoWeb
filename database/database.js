const Sequelize = require ('sequelize');

const connection = new Sequelize('guiaperguntas','root','Ifba#2018',{
    host: 'localhost',
    dialect: 'mysql'
});
module.exports = connection;