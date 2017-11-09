"use strict";

const fs   = require("fs");
const path = require("path");

const mkdirp = require("mkdirp");
const url    = require("is-absolute-url");

module.exports = (asset, dir, options, decl, warn, result) => {
    if(url(asset.url) || !fs.existsSync(asset.absolutePath)) {
        return;
    }
    
    const source = path.resolve(options.source || path.dirname(result.opts.from));
    const output = path.resolve(options.output || path.dirname(result.opts.to));

    const relative = path.relative(source, asset.absolutePath);
    const absolute = path.join(output, relative);

    mkdirp.sync(path.dirname(absolute));

    fs.copyFileSync(asset.absolutePath, absolute);

    return `${relative.replace(/\\/g, "/")}${asset.search}${asset.hash}`;
};
