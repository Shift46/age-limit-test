const express = require('express');
const fs = require('fs');
const VK = new (require("./modules/VK"))();

let app = express();

/**
 * Порт веб-сервера.
 * @type {number}
 */
const port = process.env.PORT || 80;

/**
 * Получает тело запроса без обработки
 * @param req
 * @param res
 * @param next
 */
function rawBody(req, res, next) {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function(){
        next();
    });
}

app.use(rawBody);

app.post('/bot_age', (req, res) => {
    let data = null;

    try{
        data = JSON.parse(req.rawBody);
    }catch(e){
        console.log(e);
    }

    if(data === null){

        res.send("ok");

    }else{

        VK.answerTest(data)
            .then(r => {
                res.send(r);
            })
            .catch(err => {
                console.error(err);
                res.send("ok");
            });

    }
});

app.listen(port, function () {
    console.log('Listening on port ', port);
});