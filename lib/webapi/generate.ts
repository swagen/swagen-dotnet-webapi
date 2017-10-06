import {CodeWriter} from 'codewriter';
import {Definition, Profile} from 'swagen';

class Generator {
    private readonly code: CodeWriter = new CodeWriter;

    constructor(private definition: Definition, private profile: Profile) {
    }

    generate(): string {
        return this.code.toCode();
    }
}

export const generate = (definition: Definition, profile: Profile) => {
    const generator = new Generator(definition, profile);
    return generator.generate();
};
