const MySQL = require("mysql");
const { DATABASE } = require("../config/constants");

class DatabaseModel {
    #connection;

    constructor(){
       this.createConnection();
    }

    /* Method to create MySQL connection. */
    createConnection = async () => {
        this.#connection = MySQL.createConnection(DATABASE);
        this.#connection.connect();
    }

    /* Method to run and execute MySQL query. */
    executeQuery = async (query) => {
        return new Promise((resolve, reject) => {
            this.#connection.query(query, (error, result) => {
                if(error){
                    reject(error);
                }
                else{
                    resolve(result);
                }
            })
        });
    }
}

module.exports = DatabaseModel;