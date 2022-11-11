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
        this.#page_params = { view: "", data: {} }
    }

    wallForum = async () => {
        if(!this.#req.session?.user){
            this.#res.redirect("/");
        }
        else{
            let messageModel = new MessageModel();
            let { result: messages } = await messageModel.fetchMessages();

            let commentModel = new CommentModel();
            let { result: [{comments_json}] } = await commentModel.fetchComments();
            comments_json = (comments_json) ? JSON.parse(comments_json) : {};

            this.#page_params.view = "wall";
            this.#res.render("layouts/user.layout.ejs", { 
                PAGE_PARAMS: this.#page_params, 
                API_URL, 
                user_id: this.#req.session.user.id,
                messages, 
                comments: comments_json 
            });
        }
    }

    postMessage = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!this.#req.session?.user){
                throw Error("User must be login");
            }

            let validate_fields = checkFields(["message"], [], this.#req.body);

            if(validate_fields.status){
                let messageModel = new MessageModel();
                response_data = await messageModel.insertMessage({
                    user_id: this.#req.session.user.id,
                    message: validate_fields.result.sanitized_data.message,
                    created_at: new Date()
                });

                if(response_data.status){
                    let { first_name, last_name } = this.#req.session?.user;
                     response_data.new_message_html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/message_item.partial.ejs"), { 
                        message: {
                            id: response_data.result,
                            posted_by: `${first_name} ${last_name}`,
                            posted_date: Moment().format("MMMM Do YYYY"),
                            message: validate_fields.result.sanitized_data.message,
                            user_id: this.#req.session.user.id
                        },
                        message_comments: [],
                        API_URL,
                        user_id: this.#req.session.user.id
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

    postComment = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!this.#req.session?.user){
                throw Error("User must be login");
            }

            let validate_fields = checkFields(["message_id", "comment"], [], this.#req.body);

            if(validate_fields.status){
                let commentModel = new CommentModel();
                response_data = await commentModel.insertComment({
                    message_id: validate_fields.result.sanitized_data.message_id,
                    user_id: this.#req.session.user.id,
                    comment: validate_fields.result.sanitized_data.comment,
                    created_at: new Date()
                });

                if(response_data.status){
                    let { first_name, last_name } = this.#req.session?.user;
                    response_data.new_comment_html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/comment_item.partial.ejs"), { 
                        comment: {
                            id: response_data.result.comment_id,
                            posted_by: `${first_name} ${last_name}`,
                            posted_date: Moment().format("MMMM Do YYYY"),
                            comment: validate_fields.result.sanitized_data.comment,
                        }
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

    deleteMessage = async () => {
        let response_data = { status: false, result: {}, error: null };

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
}

module.exports = WallControllers;