"use strict";

const fs   = require("fs");
const path = require("path");

const cp     = require("cp-file");
const url    = require("is-absolute-url");
const common = require("commondir");

module.exports = (asset, dir, options, decl, warn, result) => {
    if(url(asset.url) || !fs.existsSync(asset.absolutePath)) {
        return;
    }
    
    const source = path.resolve(options.source || path.dirname(result.opts.from));
    const output = path.resolve(options.output || path.dirname(result.opts.to));

    const parent = path.resolve(common([ source, asset.absolutePath ]));
    
    // Assets sometimes don't live under source dir...
    const relative = path.relative(parent === source ? source : parent, asset.absolutePath);
    const absolute = path.join(output, relative);
    
    // Remove files already in the output dir first
    if(fs.existsSync(absolute)) {
        fs.unlinkSync(absolute);
    }

    cp.sync(asset.absolutePath, absolute);

    return `${relative.replace(/\\/g, "/")}${asset.search}${asset.hash}`;
};
