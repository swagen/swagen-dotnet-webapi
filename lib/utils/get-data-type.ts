import { DataType } from 'swagen';

function getPrimitiveTypeName(property: DataType): string {
    switch (property.primitive) {
        case 'integer':
            return 'long';
        case 'number':
            return 'double';
        case 'string': {
            switch (property.subType) {
                case 'date-time':
                    return 'DateTime';
                case 'uuid':
                    return 'Guid';
                case 'byte':
                    return 'byte';
                default:
                    return 'string';
            }
        }
        case 'boolean':
            return 'bool';
        case 'file':
        case 'object':
            return 'object';
        default:
            throw new Error(`Cannot translate primitive type ${JSON.stringify(property, null, 4)}`);
    }
}

function prefixNamespace(name: string, ns?: string): string {
    return ns ? `${ns}.${name}` : name;
}

export function getDataType(property: DataType, ns?: string): string {
    let typeName;
    if (property.primitive) {
        typeName = getPrimitiveTypeName(property);
    } else if (property.complex) {
        typeName = prefixNamespace(property.complex, ns);
    } else if (property.enum) {
        typeName = prefixNamespace(property.enum, ns);
    } else {
        throw new Error(`Cannot understand type of property in definition: ${JSON.stringify(property, null, 4)}`);
    }
    return property.isArray ? typeName + '[]' : typeName;
}
