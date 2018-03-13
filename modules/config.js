const fs = require("fs");

/**
 * Возвращает конфигурацию для ВК callback API
 * @returns {{confirmation_token: string, messsage_token: string, secret: string}}
 */
const config = function(){
    try{
        if(fs.existsSync("./modules/config.json")){
            return JSON.parse(fs.readFileSync("./modules/config.json"));
        }else if(fs.existsSync("./modules/default_config.json")){
            return JSON.parse(fs.readFileSync("./modules/default_config.json"));
        }else{
            return {
                "confirmation_token": "",
                "message_token": "",
                "secret": ""
            };
        }
    }catch(e){
        return {
            "confirmation_token": "",
            "message_token": "",
            "secret": ""
        };
    }
};

module.exports = config;