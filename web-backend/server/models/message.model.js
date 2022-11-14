const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");

class MessageModel extends DatabaseModel {
    constructor(){
        super();
    }
}

module.exports = MessageModel;