"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = exports.lookup = exports.list = void 0;
const regions = require('./regions.json');
function list() {
    return regions.filter((region) => {
        return !(!region.public);
    });
}
exports.list = list;
function lookup(opts) {
    if (opts.code) {
        return regions.find((r) => r.code === opts.code);
    }
    if (opts.name) {
        return regions.find((r) => r.name === opts.name);
    }
    if (opts.full_name) {
        return regions.find((r) => r.full_name === opts.full_name);
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