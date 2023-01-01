const Bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");
const { API_URL } = require("../config/constants");
const { checkFields, encryptPassword, comparePassword } = require("../helpers/index");

class UserControllers {
    #req;
    #res;
    #page_params;

    constructor(req = undefined, res = undefined){
        this.#req = req;
        this.#res = res;
        this.#page_params = { view: "", data: {} }
    }

    homePage = () => {
        if(this.#req.session?.user){
            this.#res.redirect("/wall");
        }
        else{
            this.#page_params.view = "index";
            this.#res.render("layouts/user.layout.ejs", { PAGE_PARAMS: this.#page_params, API_URL });
        }
    }

    /* Method to login an user */
    loginUser = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = checkFields(["email", "password"], [], this.#req.body);

            if(validate_fields.status){
                let { email, password } = validate_fields.result.sanitized_data;

                let userModel = new UserModel();
                let {result: [user]} = await userModel.fetchUser(email);

                if(user){
                    let is_password_correct = await comparePassword(password, user.password);

                    if(is_password_correct){
                        let{ password, ...user_data } = user

                        this.#req.session.user = { ...user_data };
                        this.#req.session.save();

                        response_data.status = true;
                    }
                    else{
                        response_data.error = "Password is incorrect.";
                    }
                }
                else{
                    response_data.error = "No user found";
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

    /* Method to register an user */
    registerUser = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = checkFields(["first_name", "last_name", "email", "password", "confirm_password"], [], this.#req.body);

            if(validate_fields.status){
                let { first_name, last_name, email, password, confirm_password } = validate_fields.result.sanitized_data;

                if(password === confirm_password){
                    let encrypted_password = await encryptPassword(password);

                    let new_user = {
                        first_name,
                        last_name,
                        email,
                        password: encrypted_password,
                        created_at: new Date()
                    };

                    let userModel = new UserModel();
                    response_data = await userModel.insertUser(new_user);
                }
                else{
                    response_data.error = "Password should be matched.";
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
}

module.exports = UserControllers;