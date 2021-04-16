"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var utils_1 = require("./utils");
var config = utils_1.getConfig();
module.exports = function webpackRule() {
    return {
        test: config.resourceMatcher,
        use: path_1.default.join(__dirname, 'webpack-loader'),
        exclude: /node_modules/,
    };
};
