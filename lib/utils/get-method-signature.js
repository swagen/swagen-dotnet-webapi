'use strict';

const getDataType = require('./get-data-type');
const getReturnType = require('./get-return-type');

function getMethodSignature(operationName, operation, options) {
    options = options || {};
    let modelsNs = options.modelsNs;

    let parameters = '';
    for (let p = 0; p < (operation.parameters || []).length; p++) {
        let parameter = operation.parameters[p];
        if (parameters) {
            parameters += ', '
        }
        parameters += `${getDataType(parameter.dataType, modelsNs)} ${parameter.name}`;
    }

    // let returnType = getReturnType(operation, { modelsNs: modelsNs });
    // if (typeof options.returnTypeTransformer === 'function') {
    //     returnType = options.returnTypeTransformer(returnType);
    // }

    let methodSig = `IHttpActionResult ${operationName}(${parameters})`;
    return methodSig;
}

module.exports = getMethodSignature;
