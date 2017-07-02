'use strict';

const prompts = require('./prompts');
const configBuilderFn = require('./config-builder');

module.exports = [
    {
        name: 'webapi-fx',
        description: 'Empty ASP.NET Web API controllers for the .NET Framework',
        language: 'csharp',
        extension: 'cs',
        prompts: prompts.fx,
        configBuilderFn: configBuilderFn.fx
    },
    {
        name: 'webapi-core',
        description: 'Empty ASP.NET Web API controllers for .NET Core',
        language: 'csharp',
        extension: 'cs',
        prompts: prompts.core,
        configBuilderFn: configBuilderFn.core
    }
];
