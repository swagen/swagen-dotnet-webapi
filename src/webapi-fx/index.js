'use strict';

const _ = require('lodash');

const swagenCore = require('swagen-core');

const cs = require('../utils');

module.exports = class Generator {
    constructor(definition, profile) {
        this.definition = definition;
        this.profile = profile;

        this.transform = new swagenCore.transformer.Transformer(profile);
        this.transform.transformDefinition(this.definition);
    }

    generate() {
        this.code = new swagenCore.CodeBuilder();
        this.generateUsings();
        this.code.blank();
        this.code
            .line(`namespace ${this.profile.options.namespace}`)
            .line(`{`)
            .indent();
        this.generateServices();
        this.code.blank();
        this.generateModels();
        this.code.unindent(`}`);
        return this.code.toCode();
    }

    generateUsings() {
        this.code
            .line(`using System;`)
            .line(`using System.Net;`)
            .line(`using System.Net.Http;`)
            .line(`using System.Web.Http;`)
            .line(`using System.Web.Http.Description;`)
            .blank()
            .line(`using Newtonsoft.Json;`)
            .blank()
            .line(`// ReSharper disable InconsistentNaming`);
    }

    generateServices() {
        let sortedKeys = _.keys(this.definition.services).sort();
        for (let i = 0; i < sortedKeys.length; i++) {
            this.code.blank(i > 0);

            let serviceName = sortedKeys[i];
            let service = this.definition.services[serviceName];

            this.code
                .line(`public partial class ${serviceName}Controller : ApiController`)
                .line(`{`)
                .indent();
            this.generateService(serviceName, service);
            this.code.unindent(`}`);
        }
    }

    generateService(serviceName, service) {
        for (let operationName in service) {
            let operation = service[operationName];

            this.code.line(`[Http${_.upperFirst(_.lowerCase(operation.verb))}]`);

            let route = operation.path || '';
            if (_.startsWith(route, '/')) {
                route = route.substring(1);
            }
            this.code.line(`[Route("${route}")]`);

            let returnType = cs.getReturnType(operation);
            if (returnType) {
                this.code.line(`[ResponseType(typeof(${returnType}))]`)
            }

            this.code
                .line(`public ${cs.getMethodSignature(operationName, operation)}`)
                .line(`{`)
                .indent()
                    .line(`var __response = new HttpResponseMessage(HttpStatusCode.OK);`)
                    .inline(`__Process${operationName}(__response`)
                        .repeat(operation.parameters, (cb, p) => {
                            cb.inline(`, ${p.name}`)
                        })
                        .inline(`);`)
                        .done()
                    .line(`return ResponseMessage(__response);`)
                .unindent(`}`);

            this.code.blank();

            this.code
                .inline(`partial void __Process${operationName}(HttpResponseMessage __response`)
                .repeat(operation.parameters, (cb, p) => {
                    let dataType = cs.getDataType(p.dataType);
                    cb.inline(`, ${dataType} ${p.name}`)
                })
                .inline(`);`)
                .done();

            this.code.blank();
        }
    }

    generateModels() {
        let sortedKeys = _.keys(this.definition.models).sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));

        for (let i = 0; i < sortedKeys.length; i++) {
            let modelName = sortedKeys[i];
            let model = this.definition.models[modelName];

            this.code.blank(i > 0);

            this.code
                .line(`public sealed class ${modelName}`)
                .line(`{`)
                .indent();

            for (let propertyName in model) {
                let property = model[propertyName];
                this.code
                    .inline(`[JsonProperty("${property.originalName || propertyName}"`)
                    .inline(`, Required = Required.AllowNull`, !!property.required)
                    .inline(`)]`)
                    .done();
                this.code.line(`public ${cs.getDataType(property)} ${propertyName} { get; set; }`);
                this.code.blank();
            }

            this.code.unindent('}');
        }

        let enumKeys = _.keys(this.definition.enums).sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));

        for (let i = 0; i < enumKeys.length; i++) {
            let enumName = enumKeys[i];
            this.code.blank(sortedKeys.length > 0 || i > 0);
            this.code
                .line(`public enum ${enumName}`)
                .line(`{`)
                .indent()
                    .repeat(this.definition.enums[enumName], (cb, enumItem, idx) => {
                        cb.line(`${enumItem},`);
                    })
                .unindent(`}`)
        }

        this.code.blank(sortedKeys.length > 0 || enumKeys.length > 0);
    }
}
