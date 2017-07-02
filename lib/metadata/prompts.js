'use strict';

const namespacePrompt = {
    type: 'input',
    name: 'namespace',
    message: 'Namespace to generate',
    validate: value => !!value
};

module.exports = {
    core: [
        namespacePrompt
    ],
    fx: [
        namespacePrompt
    ]
};
