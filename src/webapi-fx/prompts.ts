export const prompts = [{
    type: 'input',
    name: 'namespace',
    message: 'Namespace to generate',
    validate: (value: string) => !!value,
}];
