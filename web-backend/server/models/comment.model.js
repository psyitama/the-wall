const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");
const { BOOLEAN_FIELD } = require("../config/constants");

class CommentModel extends DatabaseModel {
    constructor(){
        super();
    }

    /* Method to insert a comment. */
    insertComment = async (post_data) => {
        let response_data = { status: false, result: 0, error: null };

        try{
            let insert_comment_query = mysqlFormat(`INSERT INTO comments SET ?, created_at = NOW()`, [post_data]);
            let insert_comment_result = await this.executeQuery(insert_comment_query);

            if(insert_comment_result.affectedRows){
                response_data.result = { message_id: post_data.message_id, comment_id: insert_comment_result.insertId };
                response_data.status = true;
            }
            else{
                response_data.error = "Failed to insert comment";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    /* Method to delete a comment. */
    deleteComment = async (comment_id) => {
        let response_data = { status: false, result: 0, error: null };

        try{
            let delete_comment_query = mysqlFormat(`UPDATE comments SET is_archived = ${BOOLEAN_FIELD.true_value}, updated_at = NOW() WHERE id = ?`, [comment_id]);
            let delete_comment_result = await this.executeQuery(delete_comment_query);

            if(delete_comment_result.affectedRows){
                response_data.result = comment_id;
                response_data.status = true;
            }
            else{
                response_data.error = "Failed to delete comment";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = CommentModel;