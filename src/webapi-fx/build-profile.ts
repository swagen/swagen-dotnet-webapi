import { WebApiFxOptions } from '../../typings/index';

export const buildProfile = (options: WebApiFxOptions, answers: { [key: string]: {}}) => {
    options.namespace = answers.namespace as string;
};
