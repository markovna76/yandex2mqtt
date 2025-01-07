module.exports =
  {
    env: {
     // oauth_token - Токен с Яндекса https://yandex.ru/dev/dialogs/smart-home/doc/ru/reference-alerts/resources-alerts#oauth
      oauth_token: 'ToKeN',
     // user_id - Пользователь, который делает notification в Yandex
      user_id: '2'
    },

    mqtt: {
      "host": "192.168.1.11",
      "port": 8883,
      "user": "mqttLogin",
      "password": "mqttPassword"
    },

    http: {
      ssl: true,
      privateKey:  '/alisa/configs/tls.key',
      certificate: '/alisa/configs/tls.crt',
      port: 4433
    },

    clients: [
      {
        id: '1',
        name: 'Yandex',
        clientId: 'SmartHomeID',
        clientSecret: 'ClientSecret',
        isTrusted: false
      }
    ],

    users: [
      {
        id: '1',
        username: 'admin',
        password: 'AdminPassword',
        name: 'Administrator'
      },
      {
        id: '2',
        username: 'user',
        password: 'UserPassword',
        name: 'User'
      }
    ],

  }
