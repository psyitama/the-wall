const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");

class MessageModel extends DatabaseModel {
    constructor(){
        super();
    }

    fetchMessages = async (post_data) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_messages_query = mysqlFormat(`
                SELECT 
                    messages.id, messages.message, messages.user_id,
                    CONCAT(users.first_name, ' ', users.last_name) AS posted_by, DATE_FORMAT(messages.created_at, "%M %D %Y") AS posted_date
                FROM messages
                INNER JOIN users ON users.id = messages.user_id
                WHERE messages.is_archived = 0;
            `);
            let fetch_messages_result = await this.executeQuery(fetch_messages_query);

            response_data.result = fetch_messages_result;
            response_data.status = true;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    insertMessage = async (post_data) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let insert_message_query = mysqlFormat(`INSERT INTO messages SET ?`, [post_data]);
            let insert_message_result = await this.executeQuery(insert_message_query);

            response_data.result = insert_message_result.insertId;
            response_data.status = (insert_message_result?.insertId > 0);
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    deleteMessage = async (message_id) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let delete_message_query = mysqlFormat(`UPDATE messages SET is_archived = 1 WHERE id = ?`, [message_id]);
            let delete_message_result = await this.executeQuery(delete_message_query);

            response_data.result = message_id;
            response_data.status = (delete_message_result?.affectedRows > 0);
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = MessageModel;