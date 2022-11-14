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
            this.#page_params.view = "wall";
            this.#res.render("layouts/user.layout.ejs", {
                PAGE_PARAMS: this.#page_params,
                API_URL,
                user_id: this.#req.session.user.id,
            });
        }
    }
}

module.exports = WallControllers;