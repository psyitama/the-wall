const Ejs = require("ejs");
const Moment = require("moment");
const Path = require("path");
const { API_URL } = require("../config/constants");
const CommentModel = require("../models/comment.model");
const MessageModel = require("../models/message.model");
const { checkFields } = require("../helpers/index");

class WallControllers {
    #req;
    #res;
    #page_params;

    constructor(req = undefined, res = undefined){
        this.#req = req;
        this.#res = res;
        this.#page_params = { view: "", data: [] }
    }

    /* Method show wall page, fetch messages and comments */
    wallForum = async () => {
        if(!this.#req.session?.user){
            this.#res.redirect("/");
        }
        else{
            this.#page_params.view = "wall";

            let messageModel = new MessageModel();
            let fetch_messages = await messageModel.fetchMessages();
            
            if(fetch_messages.status){
                this.#page_params.data = fetch_messages.result;
            }
            else{
                throw new Error("Failed to fetch messages");
            }

            this.#res.render("layouts/user.layout.ejs", {
                PAGE_PARAMS: this.#page_params,
                API_URL,
                current_user_id: this.#req.session.user.id,
            });
        }
    }

    /* Method to post a message */
    postMessage = async () => {
        let response_data = { status: false, result: [], error: null };

        try{
            let validate_fields = checkFields(["message"], [], this.#req.body);

            if(validate_fields.status){

                let messageModel = new MessageModel();
                response_data = await messageModel.insertMessage({
                    message: validate_fields.result.sanitized_data.message,
                    user_id: this.#req.session.user.id
                });

                if(response_data.status){
                    let { first_name, last_name } = this.#req.session?.user;
                    response_data.new_message_html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/message_item.partial.ejs"), {
                        message: {
                            id: response_data.result,
                            posted_by: `${first_name} ${last_name}`,
                            posted_on: Moment().format("MMMM Do YYYY"),
                            message: validate_fields.result.sanitized_data.message,
                            user_id: this.#req.session?.user.id,
                            comments: "[]"
                        },
                        API_URL,
                        current_user_id: this.#req.session?.user.id
                    });
                }
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
        }

        this.#res.json(response_data);
    }

    /* Method to post a comment */
    postComment = async () => {
        let response_data = { status: false, result: [], error: null };

        try{
            let validate_fields = checkFields(["message_id", "comment"], [], this.#req.body);

            if(validate_fields.status){
                let commentModel = new CommentModel();
                response_data = await commentModel.insertComment({
                    message_id: validate_fields.result.sanitized_data.message_id,
                    comment: validate_fields.result.sanitized_data.comment,
                    user_id: this.#req.session.user.id
                });

                if(response_data.status){
                    let { first_name, last_name } = this.#req.session?.user;
                    response_data.new_comment_html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/comment_item.partial.ejs"), {
                        comment: {
                            id: response_data.result.comment_id,
                            posted_by: `${first_name} ${last_name}`,
                            posted_on: Moment().format("MMMM Do YYYY"),
                            comment: validate_fields.result.sanitized_data.comment,
                            user_id: this.#req.session?.user.id
                        },
                        API_URL,
                        current_user_id: this.#req.session?.user.id
                    });
                }
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
        }

        this.#res.json(response_data);
    }

    /* Method to delete a message */
    deleteMessage = async () => {
        let response_data = { status: false, result: [], error: null };

        try{
            let validate_fields = checkFields(["message_id"], [], this.#req.body);

            if(validate_fields.status){

                let messageModel = new MessageModel();
                response_data = await messageModel.deleteMessage(validate_fields.result.sanitized_data.message_id);
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
        }

        this.#res.json(response_data);
    }

    /* Method to delete a comment */
    deleteComment = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = checkFields(["comment_id"], [], this.#req.body);

            if(validate_fields.status){
                let commentModel = new CommentModel();
                response_data = await commentModel.deleteComment(validate_fields.result.sanitized_data.comment_id);
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
        }

        this.#res.json(response_data);
    }
}

module.exports = WallControllers;