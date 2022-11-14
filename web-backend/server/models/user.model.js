const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");

class UserModel extends DatabaseModel{
    constructor() {
        super();
    }

    fetchUser = async (email_address) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_user_query = mysqlFormat(`SELECT * FROM users WHERE email = ? LIMIT 1;`, [email_address]);
            let fetch_user_result = await this.executeQuery(fetch_user_query);

            response_data.result = fetch_user_result;
            response_data.status = true;
        }
        catch(error){
            response_data.error = error;
        }
        console.log(response_data); 
        return response_data;
    }

    insertUser = async (post_data) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let insert_user_query = mysqlFormat(`INSERT INTO users SET ?`, [post_data]);
            let insert_user_result = await this.executeQuery(insert_user_query);

            response_data.result = insert_user_result;
            response_data.status = (insert_user_result.affectedRows > 0);
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = UserModel;