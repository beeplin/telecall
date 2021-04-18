"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var config = utils_1.getConfig();
var resourceMatcher = config.resourceMatcher;
function default_1() {
    return {
        name: 'telecall',
        resolveId: function (id) {
            if (resourceMatcher.test(id))
                return id;
            return null;
        },
        load: function (id) {
            if (resourceMatcher.test(id))
                return utils_1.mockResource(id, config);
            return null;
        },
    };
}
exports.default = default_1;
