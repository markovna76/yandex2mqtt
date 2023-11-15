module.exports = {
    mqtt: {
        host: 'localhost',
        port: 1883,
        user: 'user',
        password: 'password',
    },

    https: {
        privateKey: '/etc/letsencrypt/live/your.domain.ru/privkey.pem',
        certificate: '/etc/letsencrypt/live/your.domain.ru/fullchain.pem',
        port: 4433,
    },

    clients: [
        {
            id: '1',
            name: 'Yandex',
            clientId: 'client',
            clientSecret: 'secret',
            isTrusted: false,
        },
    ],

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

    devices: [
        // Please configure with '--devices ./data/devices.js', see 'config.devices.orig.js'
    ],
};
