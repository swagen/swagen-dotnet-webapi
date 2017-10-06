import { OperationDefinition } from 'swagen';
import { getDataType } from './get-data-type';

export interface ReturnTypeOptions {
    useTask?: boolean;
    namespace?: string;
}

export function getReturnType(operation: OperationDefinition, options: ReturnTypeOptions) {
    options = options || {};
    let useTask = options.useTask;
    let modelsNs = options.namespace;

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
