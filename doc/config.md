# Настройка yandex2mqtt

Все основные настройки моста прописываются в файл `config.js`. Перед запуском обязательно отредактируйте его.
```bash
mv config.orig.js config.js
```

## Файл конфигурации
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

### Блок настройки mqtt клиента
Указать данные Вашего MQTT сервера
```js
mqtt: {
    host: 'localhost',
    port: 1883,
    user: 'user',
    password: 'password',
},
```

### Блок настройки https сервера
Указать порт, на котором будет работать мост, а так же пути к сертификату ssl.
```js
https: {
  privateKey: '/etc/letsencrypt/live/your.domain.ru/privkey.pem',
  certificate: '/etc/letsencrypt/live/your.domain.ru/fullchain.pem',
  port: 4433
},
```

### Блок настройки клиентов
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

### Блок настройки пользователей
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

### Блок настройки устройств
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