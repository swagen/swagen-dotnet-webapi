import { getDataType } from './get-data-type'
import { getReturnType } from './get-return-type';
import { OperationDefinition } from 'swagen';

export interface MethodSignatureOptions {
    namespace?: string;
}

export function getMethodSignature(operationName: string, operation: OperationDefinition, options: MethodSignatureOptions) {
    options = options || {};
    const namespace = options.namespace;

    const parameters = (operation.parameters || []).reduce((accumulate, parameter) => {
        if (accumulate) {
            accumulate += ', ';
        }
        return accumulate + `${getDataType(parameter.dataType, namespace)} ${parameter.name}`;
    }, '');

    const methodSig = `IHttpActionResult ${operationName}(${parameters})`;
    return methodSig;
}
