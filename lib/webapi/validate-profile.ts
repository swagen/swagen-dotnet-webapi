import { WebApiFxOptions } from '../../typings/index';

export const validateProfile = (options: WebApiFxOptions) => {
    if (!options.namespace) {
        throw `Specify an 'options.namespaces' section in your profile.`;
    }
};
