'use strict';

/**
 * egg-rpc4js default config
 * @member Config#rpc4js
 * @property {String} SOME_KEY - some description
 */
exports.rpc4js = {
    registry: {
        address: '127.0.0.1:2181'
    },
    client: {
        services: [],
        responseTimeout: 3000
    }
};
