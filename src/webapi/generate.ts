import { CodeWriter, OptionsLibrary } from 'codewriter';
import * as _ from 'lodash';
import { DataType, Definition, GeneratorProfile, OperationDefinition, ServiceDefinition } from 'swagen';

import { WebApiFxOptions } from '../../typings/index';
import { cs } from '../utils';

class Generator {
    private readonly code: CodeWriter;
    private readonly options: WebApiFxOptions;

    constructor(private definition: Definition, private profile: GeneratorProfile<WebApiFxOptions>) {
        this.code = new CodeWriter(OptionsLibrary.csharp);
        this.options = profile.options;
    }

    public generate(): string {
        this.code
            .func(code => this.generateUsings(code))
            .blank()
            .startBlock(`namespace ${this.options.namespace}`)
                .func(code => this.generateServices(code))
                .blank()
                .func(code => this.generateModels(code))
            .endBlock();
        return this.code.toCode();
    }

    private generateUsings(code: CodeWriter): void {
        code.line(`using System;`)
            .line(`using System.Net;`)
            .line(`using System.Net.Http;`)
            .line(`using System.Web.Http;`)
            .line(`using System.Web.Http.Description;`)
            .blank()
            .line(`using Newtonsoft.Json;`)
            .blank()
            .line(`// ReSharper disable InconsistentNaming`);
    }

    private generateServices(code: CodeWriter): void {
        const serviceNames = _.keys(this.definition.services).sort();
        code.repeat(serviceNames, (cw, serviceName, i) => {
            const service = this.definition.services[serviceName];
            cw.blank(i > 0)
                .startBlock(`public partial class ${serviceName}Controller : ApiController`)
                    .func(cw2 => this.generateService(cw2, serviceName, service))
                .endBlock();
        });
    }

    private generateService(code: CodeWriter, serviceName: string, service: ServiceDefinition): void {
        code.iterate(service, (cw, operation: OperationDefinition, operationName, i) => {
            let route = operation.path || '';
            if (_.startsWith(route, '/')) {
                route = route.substring(1);
            }
            const returnType = cs.getReturnType(operation, {});

            cw.blank(i > 0)
                .line(`[Http${_.upperFirst(_.lowerCase(operation.verb))}]`)
                .line(`[Route("${route}")]`)
                .lineIf(!!returnType, `[ResponseType(typeof(${returnType}))]`)
                .startBlock(`public ${cs.getMethodSignature(operationName, operation, {})}`)
                    .line(`var __response = new HttpResponseMessage(HttpStatusCode.OK);`)
                    .inline(`__Process${operationName}(__response`)
                        .repeat(operation.parameters, (cw2, p) => {
                            cw2.inline(`, ${p.name}`);
                        })
                        .inline(`);`)
                    .done()
                    .line(`return ResponseMessage(__response);`)
                .endBlock()
                .blank()
                .inline(`partial void __Process${operationName}(HttpResponseMessage __response`)
                    .repeat(operation.parameters, (cw2, p) => {
                        const dataType = cs.getDataType(p.dataType);
                        cw2.inline(`, ${dataType} ${p.name}`);
                    })
                    .inline(`);`)
                .done();
        });
    }

    private generateModels(code: CodeWriter): void {
        const modelNames = _.keys(this.definition.models)
            .sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));
        const enumNames = _.keys(this.definition.enums).sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()));

        code.repeat(modelNames, (cw, modelName, i) => {
            const model = this.definition.models[modelName];
            cw.blank(i > 0)
                .startBlock(`public sealed class ${modelName}`)
                    .iterate(model, (cw2, property: DataType, propertyName, i2) => {
                        cw2.blank(i2 > 0)
                            .inline(`[JsonProperty("${property.originalName || propertyName}"`)
                                .inline(`, Required = Required.AllowNull`, !!property.required)
                                .inline(`)]`)
                            .done()
                            .line(`public ${cs.getDataType(property)} ${propertyName} { get; set; }`);
                    })
                .endBlock();
        })
        .blank(modelNames.length > 0)
        .repeat(enumNames, (cw, enumName, i) => {
            const enumType = this.definition.enums[enumName];
            cw.blank(i > 0)
                .startBlock(`public enum ${enumName}`)
                    .repeat(enumType, (cw2, enumItem) => {
                        cw2.line(`${enumItem},`);
                    })
                .endBlock();
        });
    }
}

export const generate = (definition: Definition, profile: GeneratorProfile<WebApiFxOptions>) => {
    const generator = new Generator(definition, profile);
    return generator.generate();
};
