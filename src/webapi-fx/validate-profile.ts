import { WebApiFxOptions } from '../../typings/index';

export const validateProfile = (options: WebApiFxOptions) => {
    if (!options.namespace) {
        throw new Error(`Specify an 'options.namespaces' section in your profile.`);
    }
};
