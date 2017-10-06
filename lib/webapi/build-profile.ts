import { WebApiFxOptions } from '../../typings/index';

export const buildProfile = (options: WebApiFxOptions, answers: { [key: string]: Object }) => {
    options.namespace = answers.namespace as string;
};
