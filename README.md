# БОТ Возрастной рейтинг в ВК

Бот позволяет узнать возрастной рейтинг компьютерной игры\фильма\изображения или другого материала в ответно-вопросной форме в ВК.

Пример бота: [https://vk.com/im?sel=-163364156](https://vk.com/im?sel=-163364156)

# Установка и запуск

Для установки всех необходимых модулей используйте команду `npm install`

Для установки *mocha(тесты), jsdoc(документация) и nodemon* используйте команду `npm install --dev`

Для запуска используйте команду `npm run start`

Для запуска `nodemon` используйте команду `npm run dev`.

Бот запускается по пути *https://ваш_сайт/bot_age*

Перед запуском необходимо создать файл *config.js* в папке *modules*. Пример содержимого находится в файле *default_config.json*

```
{
  "confirmation_token": "",//Код для подтверждения сервера, выводится при создании сервера
  "message_token": "", //Ключ доступа сообщества с правом отправлять сообщения
  "secret": ""//Секретный ключ, указывается в настройке сервера в ВК и здесь для защиты данных
}
```

# Документация

Документация по программе находится в папке *docs*. 

Команда для создания документации `npm run docs`

# Тесты

Для запуска тестов используйте команду: `npm run test`

# Лицензия

Программа распространяется по лицензии [Apache License 2.0](./LICENSE)