"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.lookup = exports.list = void 0;
const regions_json_1 = __importDefault(require("./regions.json"));
function list() {
    return regions_json_1.default.filter((region) => {
        return !(!region.public);
    });
}
exports.list = list;
function lookup(opts) {
    if (opts.code) {
        return regions_json_1.default.find((r) => r.code === opts.code);
    }
    if (opts.name) {
        return regions_json_1.default.find((r) => r.name === opts.name);
    }
    if (opts.full_name) {
        return regions_json_1.default.find((r) => r.full_name === opts.full_name);
    }
}
exports.lookup = lookup;
function get(nameOrCode) {
    console.warn(".get() method is deprecated! Use .lookup({ code: '' }) or .lookup({ name: '' }) instead.");
    return nameOrCode.match(/[0-9]$/)
        ? lookup({ code: nameOrCode })
        : lookup({ name: nameOrCode });
}
exports.get = get;
//# sourceMappingURL=index.js.map