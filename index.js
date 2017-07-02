'use strict';

const _ = require('lodash');

const modeMappings = {
    'webapi-core': 'webapi-core',
    'webapi-fx': 'webapi-fx'
};


function generate(definition, profile) {
    let mode = modeMappings[profile.mode || 'webapi-fx'];
    let Generator = require(`./lib/${mode}`);
    let generator = new Generator(definition, profile);
    return generator.generate();
}

function validateProfile(profile) {
}

module.exports = {
    modes: require('./lib/metadata'),
    generate: generate,
    validateProfile: validateProfile
};
