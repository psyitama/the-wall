const Bcrypt = require("bcrypt");

const GlobalHelpers = {};

GlobalHelpers.checkFields = (required_fields, optional_fields = [], req_body) => {
    let response_data = { status: false, result: {}, error: null };

    try{
        if(!Array.isArray(required_fields) || !Array.isArray(optional_fields)){
            throw Error("Arguments must be an array.");
        }

        let all_fields = required_fields.concat(optional_fields);
        let sanitized_data = [];
        let missing_fields = [];

        for(let index in all_fields){
            let selected_key = all_fields[index];
            let selected_value = req_body[selected_key] !== undefined ?  req_body[selected_key] : "";

            if(String(selected_value).trim() === "" && required_fields.includes(selected_key)){
                missing_fields.push(selected_key)
            }
            else{
                sanitized_data[selected_key] = selected_value;
            }

            response_data.status = missing_fields.length === 0;
            response_data.result = (response_data.status) ? {sanitized_data} : {missing_fields};
        }
    }
    catch(error){
        response_data.error = error;
    }

    return response_data;
}

GlobalHelpers.encryptPassword = (plain_password) => {
    return new Promise((resolve, reject) => {
        const salt_rounds = 10;

        Bcrypt.genSalt(salt_rounds, (err, salt) => {
            if(err){
                reject(err);
            }
            else{
                Bcrypt.hash(plain_password, salt, async(err, hash) => {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(hash);
                    }
                });
            }
        });
    });
}

GlobalHelpers.comparePassword = (submitted_password, current_password) => {
    return new Promise((resolve, reject) => {
        Bcrypt.compare(submitted_password, current_password, (err, result) => {
            if(err){
                reject(err);
            }
            else{
                resolve(result);
            }
        });
    });
}

module.exports = GlobalHelpers;