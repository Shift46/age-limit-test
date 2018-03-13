const assert = require('assert');
const VK = new (require("../modules/VK"))();/**
 * Created by Кирилл on 13.03.2018.
 */
const Test = new (require("../modules/test"))();
const fs = require('fs');

let stages;
try{
    stages = JSON.parse(fs.readFileSync("stages.json", "utf8"));
}catch(e){
    console.error("Ошибка запуска теста");
    console.error(e);
}

describe('БОТ', function(){
    describe('config', function() {
        it('должен получить config.json без ошибок', function(done) {
            const config = require("../modules/config")();
            if(config && config !== null && config !== undefined){
                done();
            }else{
                done("Не получилось загрузить config");
            }
        });

        it('должен получить стандартный config, если не получилось считать из файла', function(done) {
            let c = "";

            try{
                fs.renameSync("./modules/config.json", "./modules/config_temp.json");
                c = JSON.parse(fs.readFileSync("./modules/default_config.json", "utf8"));
            }catch(e){
                done(e);
            }

            const config = require("../modules/config")();

            if(JSON.stringify(config) === JSON.stringify(c)){
                try{
                    fs.renameSync("./modules/config_temp.json", "./modules/config.json");
                }catch(e){
                    done(e);
                }

                done();
            }else{
                try{
                    fs.renameSync("./modules/config_temp.json", "./modules/config.json");
                }catch(e){
                    done(e);
                }

                done("Не получилось загрузить config");
            }
        });
    });


    describe('test', function() {
        it("должен прислать первый вопрос теста пользователю, который впервые написал боту", function(done){
            Test.findAnswer(1, "a")
                .then(r => {
                    if(r === stages[0].text){
                        done();
                    }else{
                        done("Не тот текст");
                    }
                })
                .catch(done);
        });

        it("должен прислать второй вопрос теста пользователю, который ответил нет на первый вопрос", function(done){
            Test.findAnswer(1, "a")
                .then(_ => Test.findAnswer(1, "нет"))
                .then(r => {
                    if(r === stages[1].text){
                        done();
                    }else{
                        done("Не тот текст");
                    }
                })
                .catch(done);
        });

        it("должен прислать ответ на первый этап теста, если пользователь ответил да", function(done){
            Test.findAnswer(123456789, "а")
                .then(_ => Test.findAnswer(123456789, "да"))
                .then(r => {
                    if(r === "Рейтинг вашего материала: " + stages[0].name){
                        done();
                    }else{
                        done("Не тот текст: " + r);
                    }
                })
                .catch(done);
        });

        it("должен прислать ответ, если пользователь всегда отвечал нет", function(done){
            Test.findAnswer(123456789, "а")
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(r => {
                    if(r === "Рейтинг вашего материала: " + stages[stages.length - 1].name){
                        done();
                    }else{
                        done("Не тот текст: " + r);
                    }
                })
                .catch(done);
        });

        it("должен прислать первый вопрос теста,если пользователь завершил предыдущий тест", function(done){
            Test.findAnswer(123456789, "а")
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "нет"))
                .then(_ => Test.findAnswer(123456789, "a"))
                .then(r => {
                    if(r === stages[0].text){
                        done();
                    }else{
                        done("Не тот текст: " + r);
                    }
                })
                .catch(done);
        });

        it("должен попросить ответить да или нет, если пользователь прислал неправильный ввод", function(done){
            Test.findAnswer(123456789, "а")
                .then(_ => Test.findAnswer(123456789, "а"))
                .then(r => {
                    if(r === 'Отвечайте "да" или "нет" (без кавычек)'){
                        done();
                    }else{
                        done("Не тот текст: " + r);
                    }
                })
                .catch(done);
        });
    });
});

