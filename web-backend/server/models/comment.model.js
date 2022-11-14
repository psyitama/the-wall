const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");

class CommentModel extends DatabaseModel {
    constructor(){
        super();
    }
}

module.exports = CommentModel;