const { format: mysqlFormat } = require("mysql");
const DatabaseModel = require("./database.model");

class CommentModel extends DatabaseModel {
    constructor(){
        super();
    }

    fetchComments = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_comments_query = mysqlFormat(`
                SELECT JSON_OBJECTAGG(message_id, comment_json) AS comments_json
                FROM (
                    SELECT 
                        message_id,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                "id", comments.id,
                                "posted_by", CONCAT(users.first_name, ' ', users.last_name),
                                "posted_date", DATE_FORMAT(comments.created_at, "%M %D %Y")
                            )
                        ) AS comment_json
                    FROM comments
                    INNER JOIN users ON users.id = comments.user_id
                    GROUP BY message_id
                ) AS derived_comments;
            `);
            let fetch_comments_result = await this.executeQuery(fetch_comments_query);

            response_data.result = fetch_comments_result;
            response_data.status = true;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    insertComment = async (post_data) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let insert_comment_query = mysqlFormat(`INSERT INTO comments SET ?`, [post_data]);
            let insert_comment_result = await this.executeQuery(insert_comment_query);

            response_data.result = { comment_id: insert_comment_result.insertId, message_id: post_data.message_id};
            response_data.status = (insert_comment_result?.insertId > 0);
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = CommentModel;