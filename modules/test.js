const fs = require('fs');


/**
 * Содержит функции для теста
 * @class
 */
const test = function(){
    /**
     * Переменная содержит список текущих пользователей
     * @private
     * @type {string[]}
     */
    let users = {};

    /**
     * Переменная содержит этапы теста
     * @private
     * @type {string[]}
     */
    let stages = [];

    /**
     * Возвращает ответ на тест в случае положительного ответа
     * @param {number} user ID пользователя ВК
     * @returns {string}
     */
    function yes(user){
        let stage = stages[users[user]].name;
        delete users[user];

        return "Рейтинг вашего материала: " + stage;
    }

    /**
     * Возвращает ответ на тест в случае отрицательного ответа
     * @param {number} user ID пользователя ВК
     * @returns {string}
     */
    function no(user){
        users[user]++;

        if(users[user] === stages.length - 1){
            delete users[user];
            return "Рейтинг вашего материала: " + stages[stages.length - 1].name;
        }else{
            return stages[users[user]].text;
        }
    }

    /**
     * Возвращает ответ в зависимости от текста сообщения и ID пользователя
     * @param {number} user ID пользователя ВК
     * @param {string} message Сообщение пользователя
     * @returns {Promise} Промис, который возвращает ответ на сообщение в resolve
     */
    this.findAnswer = function(user, message){

        return new Promise((resolve, reject) => {

            if(users[user] || users[user] === 0){

                if(message === "да"){

                    resolve(yes(user));

                } else

                if(message === "нет"){

                    resolve(no(user));

                } else {

                    resolve(`Отвечайте "да" или "нет" (без кавычек)`);

                }

            }else{

                users[user] = 0;

                resolve(stages[users[user]].text)

            }

        });

    };

    /**
     * Загружает список этапов теста
     */
    function loadStages(){
        try{
            stages = JSON.parse(fs.readFileSync("./stages.json", "utf8"));
        }catch(e){
            console.error("Ошибка: не получается загрузить этапы теста!");
            console.error(e);
        }
    }

    loadStages();
};

module.exports = test;

