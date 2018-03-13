
const config = require("./config")();
const Test = new (require("./test"))();
const request = require('request');
const extend = require('extend');

/**
 * Содержит функции для работы с ВК
 * @class
 */
const VK = function(){

    /**
     * Очередь сообщений для отправки
     * @private
     * @type {string[]}
     */
    let messages = [];

    /**
     * Добавляет сообщение в очередь на отправку
     * @param {string} message
     */
    function sendMessage(message){
        let answer = {
            access_token: config.message_token,
            v: '5.0'
        };

        extend(answer, message);
        messages.push(answer);
    }

    /**
     * Отправляет первые 20 сообщений из очереди
     */
    function messageHandler(){
        let arr = messages.splice(0, 20);
        if(arr.length){

            let now = Date.now();
            arr.forEach(v => {
                if((v.delay && v.delay <= now) || !v.delay){
                    delete v.delay;
                    request.post({
                        url: 'https://api.vk.com/method/messages.send',
                        form: v
                    }, function(error, response, body){
                        if(error){
                            messages.push(v);
                        }
                    });
                }else{
                    messages.push(v);
                }
            });
        }
    }

    /**
     * Запускает проверку очереди каждую секунду
     * @private
     */
    function _init(){
        setInterval(() => {
            messageHandler();
        }, 1001);
    }

    /**
     * Отвечает на сообщение пользователя
     * @param {string} data Объект, полученный через Callback API
     * @returns {Promise} Промисы возвращает ok, если сообщение удалось обработать, либо ошибку
     */
    this.answerTest = function(data){
        return new Promise((resolve, reject) => {
            if(data.secret && data.secret === config.secret){
                if(data.type === "confirmation"){
                    resolve(config.confirmation_token);
                } else

                if(data.type === "message_new"){

                    Test.findAnswer(data.object.user_id, data.object.body.toLowerCase())
                        .then(a => {
                            sendMessage({
                                user_id: data.object.user_id,
                                message: a
                            });
                        })
                        .catch(err => console.error(err));

                    resolve("ok");

                } else{
                    reject("Wrong type");
                }
            }else{
                reject("Wrong secret");
            }
        });
    };

    _init();
};

module.exports = VK;