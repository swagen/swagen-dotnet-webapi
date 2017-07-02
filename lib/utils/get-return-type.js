'use strict';

const getDataType = require('./get-data-type');

function getReturnType(operation, options) {
    options = options || {};
    let useTask = options.useTask;
    let modelsNs = options.modelsNs;

    if (!operation.responses) {
        return useTask ? 'Task' : undefined;
    }

    for (let statusKey in operation.responses) {
        let statusCode = +statusKey;
        if (statusCode >= 200 && statusCode < 300 && operation.responses[statusKey].dataType) {
            let dataType = getDataType(operation.responses[statusKey].dataType);
            return useTask ? `Task<${dataType}>` : dataType;
        }
    }

    return useTask ? 'Task' : undefined;
}

module.exports = getReturnType;
