const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");
const { BOOLEAN_FIELD } = require("../config/constants");

class MessageModel extends DatabaseModel {
    constructor(){
        super();
    }

    /* Method to fetch messages and their comments */
    fetchMessages = async () => {
        let response_data = { status: false, result: [], error: null };

        try{
            let fetch_messages_query = mysqlFormat(`
                SELECT 
                    messages.id, user_id, message,
                    IFNULL(
                        (SELECT 
                            JSON_ARRAYAGG(JSON_OBJECT(
                                "id", comments.id, 
                                "user_id", comments.user_id,
                                "comment", comments.comment,
                                "posted_by", CONCAT(users.first_name, ' ', users.last_name),
                                "posted_on", DATE_FORMAT(comments.created_at, "%M %D, %Y"))) 
                        FROM comments 
                        INNER JOIN users ON users.id = comments.user_id
                        WHERE 
                            message_id = messages.id 
                            AND comments.is_archived = 0
                        ),
                        '[]'
                    ) AS comments,
                    CONCAT(users.first_name, ' ', users.last_name) AS posted_by, DATE_FORMAT(messages.created_at, "%M %D, %Y") AS posted_on
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

    /* Method to add a message. */
    insertMessage = async (post_data) => {
        let response_data = { status: false, result: 0, error: null };

        try{
            let insert_message_query = mysqlFormat(`INSERT INTO messages SET ?, created_at = NOW()`, [post_data]);
            let insert_message_result = await this.executeQuery(insert_message_query);

            if(insert_message_result.affectedRows){
                response_data.result = insert_message_result.insertId;
                response_data.status = true;
            }
            else{
                response_data.error = "Failed to insert message";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    /* Method to delete a message. */
    deleteMessage = async (message_id) => {
        let response_data = { status: false, result: 0, error: null };

        try{
            let delete_message_query = mysqlFormat(`UPDATE messages SET is_archived = ${BOOLEAN_FIELD.true_value}, updated_at = NOW() WHERE id = ?`, [message_id]);
            let delete_message_result = await this.executeQuery(delete_message_query);

            if(delete_message_result.affectedRows){
                response_data.result = message_id;
                response_data.status = true;
            }
            else{
                response_data.error = "Failed to delete message";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = MessageModel;