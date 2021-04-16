"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var config = utils_1.getConfig();
function default_1(source) {
    return utils_1.mockResource(this.resourcePath, config);
}
exports.default = default_1;
