# yandex2mqtt
Мост из Яндекс УД в MQTT на Node.js

Форк [Проекта](https://github.com/munrexio/yandex2mqtt) и [Статья на Хабре](https://habr.com/ru/post/465537/) к оригиналу.

## Важно
Те, кто пользуется оригинальным проектом (или его форками), обратите внимание на то, что немного изменились настройки устройств (блок `devices` в файле конфигурации).

На данный момент проверено получение температуры и влажности с датчиков (датчики дверей и движения пока в бета-тесте), и включение/выключение света (вкл./выкл. других устройств по аналогии тоже должно работать).

Прочий функционал (изменение громкости, каналов, отключение звука), поидее, так же должны работать.

## ChangeLog
###### 16.05.2021
Добавлено логирование некоторых событий.

###### 13.05.2021
Добавлена поддержка API уведомлений об изменении состояний устройств.

###### 31.03.2021
Добавлена поддрежка разделения доступа пользователей к устройствам.

###### Release
Проведён рефакторинг кода и, местами, внесены значительные правки.

Добавлена поддержка датчиков (устройств `devices.types.sensor`)

## Требования
- **"Белый" IP адрес и домен**. Если нет своего домена и белого IP адреса можно воспользоваться Dynamic DNS  сервисами (например, noip.com).
- **SSL сертификат _(самоподписанный сертификат не подойдёт)_**. Для получения сертификата можно воспользоваться [https://letsencrypt.org](https://letsencrypt.org).

## Docker

Мои сборки проекта: https://hub.docker.com/r/petrows/yandex2mqtt/tags

В корне проекта имеется DockerFile, для сборки выполнить
```bash
docker build -t yandex2mqtt -f yandex2mqtt.dockerfile .
```
Запуск контейнера (данные приложения будут сохранены в папке `/tmp/y2m-data`):
```bash
# Создание папок данных
mkdir -p /tmp/y2m-data
# Копируем файл конфигурации. ВАЖНО: требует настройки, иначе контейнер не запустится
cp config.orig.js /tmp/y2m-data/config.js
# Запуск контейнера
docker run -v /tmp/y2m-data:/opt/yandex2mqtt/data -v /tmp/y2m-data/config.js:/opt/yandex2mqtt/config.js yandex2mqtt
```

## Установка
Настройка репозитория Node JS
```bash
curl -sL https://deb.nodesource.com/setup_10.x | bash -
```

Устанавка необходимых пакетов
```bash
apt-get install -y nodejs git make g++ gcc build-essential
```

Копирование файлов y2m с git
```bash
git clone https://github.com/lasthead0/yandex2mqtt.git /opt/yandex2mqtt
```

Установка прав на директорию
```bash
chown -R root:root /opt/yandex2mqtt
```

Установка необходимых модулей nodejs
```bash
cd /opt/yandex2mqtt
npm install
```

Запуск моста (выполняется после настройки)
```bash
npm start
```

## Настройка yandex2mqtt
Все основные настройки моста прописываются в файл `config.js`. Перед запуском обязательно отредактируйте его.
```bash
mv config.orig.js config.js
```

#### Файл конфигурации
```js
module.exports = {
  notification: [
    {
      ...
    },
    ...
  ]
  mqtt: {
    ...
  },

  https: {
    ...
  },

  clients: [
    {
      ...
    },
    ...
  ],

  users: [
    {
      ...
    },
    ...
  ],

  devices: [
    {
      ...
    },
    ...
  ]
}
```

###### Блок настройки mqtt клиента
Указать данные Вашего MQTT сервера
```js
mqtt: {
    host: 'localhost',
    port: 1883,
    user: 'user',
    password: 'password',
},
```

###### Блок настройки https сервера
Указать порт, на котором будет работать мост, а так же пути к сертификату ssl.
```js
https: {
  privateKey: '/etc/letsencrypt/live/your.domain.ru/privkey.pem',
  certificate: '/etc/letsencrypt/live/your.domain.ru/fullchain.pem',
  port: 4433
},
```

###### Блок настройки клиентов
Здесь используются произвольные данные, далее они понадобятся для подключения к УД Yandex.
```js
clients: [
    {
        id: '1',
        name: 'Yandex',
        clientId: 'client',
        clientSecret: 'secret',
        isTrusted: false,
    },
],
```

###### Блок настройки пользователей
```js
users: [
    {
        id: '1',
        username: 'admin',
        password: 'admin',
        name: 'Administrator',
    },
    {
        id: '2',
        username: 'user1',
        password: 'user1',
        name: 'User',
    },
],
```

###### Блок настройки устройств
```js
devices: [
    {
        id: 'haw-002-switch',
        name: 'Свет в коридоре',
        room: 'Коридор',
        type: 'devices.types.light',
        allowedUsers: ['2'],
        mqtt: [
            {
                instance: 'on',
                set: '/yandex/controls/light_HaW_002/on',
                state: '/yandex/controls/light_HaW_002/on/state',
            },
        ],
        capabilities: [
            {
                type: 'devices.capabilities.on_off',
                retrievable: true,
            },
        ],
    },

    {
        id: 'lvr-003-switch',
        name: 'Основной свет',
        room: 'Гостиная',
        type: 'devices.types.light',
        allowedUsers: ['2'],
        mqtt: [
            {
                instance: 'on',
                set: '/yandex/controls/light_LvR_003/on',
                state: '/yandex/controls/light_LvR_003/on/state',
            },
        ],
        valueMapping: [
            {
                type: 'on_off',
                mapping: [[false, true], [0, 1]], // [yandex, mqtt]
            },
        ],
        capabilities: [
            {
                type: 'devices.capabilities.on_off',
                retrievable: true,
            },
        ],
    },

    {
        id: 'lvr-001-weather',
        name: 'В гостиной',
        room: 'Гостиная',
        type: 'devices.types.sensor',
        allowedUsers: ['2'],
        mqtt: [
            {
                instance: 'temperature',
                state: '/yandex/sensors/LvR_001_Weather/temperature',
            },
            {
                instance: 'humidity',
                state: '/yandex/sensors/LvR_001_Weather/humidity',
            },
        ],
        properties: [
            {
                type: 'devices.properties.float',
                retrievable: true,
                parameters: {
                    instance: 'temperature',
                    unit: 'unit.temperature.celsius',
                },
            },
            {
                type: 'devices.properties.float',
                retrievable: true,
                parameters: {
                    instance: 'humidity',
                    unit: 'unit.percent',
                },
            },
        ],
    },

    {
        id: 'plug-001-flower',
        name: 'Розетка для цветка',
        room: 'Гостиная',
        type: 'devices.types.socket',
        allowedUsers: ['2'],
        mqtt: [
            {
                instance: 'on',
                set: '/yandex/controls/socket_LvR_002/on',
                state: '/yandex/controls/socket_LvR_002/on/state',
            },
            {
                instance: 'power',
                state: '/yandex/controls/socket_LvR_002/power',
            },
        ],
        capabilities: [
            {
                type: 'devices.capabilities.on_off',
                retrievable: true,
            },
        ],
        properties: [
            {
                type: 'devices.properties.float',
                retrievable: true,
                parameters: {
                    instance: 'power',
                    unit: 'unit.watt',
                },
            },
        ],
    },
    {
        id: 'haw-001-motion',
        name: 'Движение',
        room: 'Коридор',
        type: 'devices.types.sensor',
        allowedUsers: ['2'],
        mqtt: [
            {
                instance: 'motion',
                state: '/yandex/sensors/HaW_001_Motion/motion',
            },
        ],
        valueMapping: [
            {
                type: 'event',
                mapping: [['not_detected', 'detected'], ['false', 'true']], // [yandex, mqtt]
            },
        ],
        properties: [
            {
                type: 'devices.properties.event',
                retrievable: true,
                reportable: true,
                parameters: {
                    instance: 'motion',
                    events: [{
                        value: 'detected'
                    },
                    {
                        value: 'not_detected'
                    }]
                },
            },
        ],
    },
    /* --- end */
],
```
*Рекомендую указывать id в конфиге, чтобы исключить "наложение" новых устройств на "старые", которые уже добавлены в навык.*

*В случае отсутсвия id в конфиге, он будет назначен автоматически по индексу в массиве.*

#### Уведомление об изменении состояний устройств
Платформа УД Яндекс предоставляет сервис уведомлений об изменении состояний устройств. При изменении состояния устройства (например, изменение влажности) yandex2mqtt будет отправлять запрос с новым состоянием.

В настройках предусмотрен блок `notification`.

```js
notification: [
    {
        skill_id: '6fca0a54-a505-4420-b774-f01da95e5c31',
        oauth_token: 'AQA11AAPv-V2BAT7o_ps6gEtrtNNjlE2ENYt96w',
        user_id: '2'
    },
]
```

Если к yandex2mqtt "подключено" несколько навыков УД, то в массиве необходимо указать настройки для каждого навыка УД, который должен получать уведомления.

`skill_id` (идентификатор вызываемого навыка, присвоенный при создании) и `oauth_token` (авторизационный токен владельца навыка) можно узнать из документации на [Уведомление об изменении состояний устройств](https://yandex.ru/dev/dialogs/smart-home/doc/reference-alerts/post-skill_id-callback-state.html), а `user_id` - id пользователя в файле конфигурации yandex2mqtt.

*Важно. Уведомления будут отправляться при изменнии mqtt топика хранящего состояние устройства. Соответственно, если для устройства не задан топик state, то уведомление для устройтва отправляться не будет.*


#### Разрешенные пользователи для устройств (allowedUsers)
В блоке конфигурации можно указать пользователей (id пользователей), для которых будет доступно устройство.

В опции `allowedUsers` указыватся массив (строковых значений) id. Если данная опция не указана, то для неё будет назначено значение ['1'];

#### Mapping значений
Блок valueMapping позволяет настроить конвертацию значений между yandex api и MQTT. Это может быть актуально для умений типа `devices.capabilities.on_off` и `devices.capabilities.toggle`.

*Например, если в УД состояние влючено/выключено соответствует значениям 1/0, то Вам понадобиться их конвертировать, т.к. в навыках Yandex значения true/false.*
```js
valueMapping: [
    {
        type: 'on_off',
        mapping: [[false, true], [0, 1]], // [yandex, mqtt]
    },
],
```
В mapping указывается миссив массивов. Первый массив - значения в yandex, второй - в MQTT.

## Документация Яндекс
- [Типы устройств](https://yandex.ru/dev/dialogs/alice/doc/smart-home/concepts/device-types.html)
- [Типы умений устройства](https://yandex.ru/dev/dialogs/alice/doc/smart-home/concepts/capability-types.html)
- [Типы встроенных датчиков](https://yandex.ru/dev/dialogs/alice/doc/smart-home/concepts/properties-types.html)

## Логирование
Добавлено две "стратегии" логирования: сообщений об ошибках в файл `log/error.log` (аргумент запуска `--log-error`) и всех сообщений в консоль (`--log-info`).
Для запуска y2m с логирование необходимо добавить аргумент запуска в команду запуска в файле настройки служба (**раздел ниже**) или запустить из консоли.

## Создание службы
В папке `/etc/systemd/system/` создать файл `yandex2mqtt.service` со следующим содержанем:
```conf
[Unit]
Description=yandex2mqtt
After=network.target

[Service]
ExecStart=/usr/bin/node app.js --log-error
WorkingDirectory=/opt/yandex2mqtt
StandardOutput=inherit
StandardError=inherit
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

Для включения службы использовать команду:
```bash
systemctl enable yandex2mqtt.service
```

Для управления службой использовать команды:
```bash
service yandex2mqtt start
```
```bash
service yandex2mqtt stop
```
```bash
service yandex2mqtt restart
```

## Создание навыка (в Яндекс Диалоги)
Заходим в [Яндекс Диалоги](https://dialogs.yandex.ru/developer) => Создать диалог => Умный дом

#### Основные настройки
- **Название** *Любое*
- **Backend** *Endpoint URL* и указываем https://your.domain.ru:port/provider
- **Тип доступа** *Приватный*

#### Публикация в каталоге
- **Подзаголовок** *Любой текст*
- **Имя разработчика** *Ваше имя*
- **Официальный навык** *Нет*
- **Описание** *Любой текст*
- **Иконка** *Своя иконка*

#### Связка аккаунтов
- **Авторизация** _Кнопка **"Создать"**_

#### Создание связки аккаунтов
- **Идентификатор приложения** *Файл конфигурации clients.clientId*
- **Секрет приложения** *Файл конфигурации clients.clientSecret*
- **URL авторизации** *https://your.domain.ru:port/dialog/authorize*
- **URL для получения токена** *https://your.domain.ru:port/oauth/token*
- **URL для обновления токена** *https://your.domain.ru:port/oauth/token*

**Сохраняем** навык. Далее можно работать с черновиком (тестировать навык) или опубликовать его (кнопка **"Опубликовать"**).

На вкладке **Тестирование** (далее кнопка **+(плюс)**) необходимо **Привязать к Яндексу** наш мост, используя имя пользователя и пароль из файла конфигурации (блок **users**). После этого можно получить список устройств.

## Известные "особенности поведения" ioBroker (iob)

#### Не изменяются и не читаются топики MQTT

Если случается такое, что Алиса получает голосовую команду и не сообщает об ошибке, но при этом топик не меняет своего значения или, при изменении стейта (объекта iob) MQTT топик не публикуется (Алиса не получает нового значения, а сообщает старое) **необходимо перезапустить адаптер mqtt**.

Аналогичная ситуация может возникнуть, если в качестве топика использовать объект iob созданный вручную. В данном случает адаптер mqtt не будет "знать", что данный объект является топиком mqtt.
Для исправления этой ошибки необходимо отредактировать объект iob: зайти в редактирование объекта и на вкладке **RAW (EXPERTS ONLY)** в json в поле **native** добавить **topic**. Пример:
```json
"native": {
  "topic": "/yandex/controls/light_BdR_002/state"
}
```
