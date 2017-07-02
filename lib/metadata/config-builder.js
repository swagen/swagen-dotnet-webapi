'use strict';

module.exports = {
    core: function(options, answers, generalAnswers) {
        options.namespace = answers.namespace;
    },

    fx: function(options, answers, generalAnswers) {
        options.namespace = answers.namespace;
    }
};
