const Yaml = require("js-yaml");
const Fs = require("fs");

const Constants = {};

let env_file = `${process.env.NODE_ENV}.env.yml`;

let file_contents = Fs.readFileSync(`${__dirname}/${env_file}`);
let data = Yaml.load(file_contents);

/* Loop constants data from yml file. */
for(let key in data){
    Constants[key] = data[key];
}

Constants.BOOLEAN_FIELD = {
    true_value: 1,
    false_value: 0
}

module.exports = Constants;