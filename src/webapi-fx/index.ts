import { prompts } from './prompts';
import { buildProfile } from './build-profile';
import { validateProfile } from './validate-profile';
import { generate } from './generate';

export = {
    name: 'webapi-fx',
    description: 'Empty ASP.NET Web API controllers for the .NET Framework',
    language: 'csharp',
    extension: 'cs',
    prompts,
    defaultTransforms: {
        serviceName: ['pascal-case'],
        operationName: ['pascal-case'],
        parameterName: ['camel-case'],
        modelName: ['pascal-case'],
        propertyName: ['pascal-case'],
    },
    buildProfile,
    validateProfile,
    generate,
};
