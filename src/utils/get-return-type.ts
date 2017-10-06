import { OperationDefinition } from 'swagen';
import { getDataType } from './get-data-type';

export interface ReturnTypeOptions {
    useTask?: boolean;
    namespace?: string;
}

export function getReturnType(operation: OperationDefinition, options: ReturnTypeOptions) {
    options = options || {};
    const useTask = options.useTask;
    const modelsNs = options.namespace;

    if (!operation.responses) {
        return useTask ? 'Task' : undefined;
    }

    for (const statusKey in operation.responses) {
        if (operation.responses.hasOwnProperty(statusKey)) {
            const statusCode = +statusKey;
            if (statusCode >= 200 && statusCode < 300 && operation.responses[statusKey].dataType) {
                const dataType = getDataType(operation.responses[statusKey].dataType);
                return useTask ? `Task<${dataType}>` : dataType;
            }
        }
    }

    return useTask ? 'Task' : undefined;
}
