const Yaml = require("js-yaml");
const Fs = require("fs");

const Constants = {};

let env_file = `${process.env.NODE_ENV}.env.yml`;

let fileContents = Fs.readFileSync(__dirname+"/"+env_file, "utf8");
let data = Yaml.load(fileContents);

for(let key in data){
    Constants[key] = data[key];
}

module.exports = Constants;