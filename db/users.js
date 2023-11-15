'use strict';

const {logger} = global;
const { cli } = global;
const { users } = require('../' + cli.cfg);

module.exports.findById = (id, done) => {
    for (const user of users) {
        if (user.id === id) return done(null, user);
    }
    logger.log('error', new Error('User Not Found'));
    return done();
};

module.exports.findByUsername = (username, done) => {
    for (const user of users) {
        if (user.username === username) return done(null, user);
    }
    logger.log('error', new Error('User Not Found'));
    return done();
};
