// const prompts = require('./prompts');
// const buildProfile = require('./build-config');
// const validateProfile = require('./validate-profile');
// const generate = require('./generate');
import { prompts } from './prompts';
import { buildProfile } from './build-profile';
import { validateProfile } from './validate-profile';
import { generate } from './generate';

export default {
    name: 'webapi-fx',
    description: 'Empty ASP.NET Web API controllers for the .NET Framework',
    language: 'csharp',
    extension: 'cs',
    prompts,
    buildProfile,
    validateProfile,
    generate,
};
