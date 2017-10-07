'use strict';

const fs = require('fs');

const definition = require('./definition.json');
const profile = require('./profile.json');
const generator = require('../lib/src/webapi');
const Transformer = require('../node_modules/swagen/lib/generate/transformer');

const transformer = new Transformer(profile);
transformer.transformDefinition(definition);

const code = generator.generate(definition, profile);
fs.writeFileSync(`./test-harness/output.${generator.extension}`, code, 'utf8');
