"use strict";

const fs = require("fs");

const rimraf = require("rimraf");
const url    = require("postcss-url");
const lsr    = require("lsr").lsrSync;
const cp     = require("cp-file");

const transform = require("../index.js");

function dir(tgt) {
    return lsr(tgt).map(({ path }) => [ path ]);
}

describe("postcss-asset-tree", () => {
    afterEach(() => {
        rimraf.sync("./tests/output")
    });

    it("should export a function", () => {
        expect(typeof transform).toBe("function");
    });

    it("should use the to/from dirs", async () => {
        await url.process(fs.readFileSync("./tests/specimens/a/b/test.css"), {
            from : "./tests/specimens/a/b/test.css",
            to   : "./tests/output/test.css"
        }, {
            url : transform
        });

        expect(dir("./tests/output")).toMatchSnapshot();
    });

    it("should support a source dir", async () => {
        await url.process(fs.readFileSync("./tests/specimens/a/b/test.css"), {
            from : "./tests/specimens/a/b/test.css",
            to   : "./tests/output/test.css"
        }, {
            source : "./tests/specimens/a",
            url    : transform
        });

        expect(dir("./tests/output")).toMatchSnapshot();
    });

    it("should support an output dir", async () => {
        await url.process(fs.readFileSync("./tests/specimens/a/b/test.css"), {
            from : "./tests/specimens/a/b/test.css",
            to   : "./tests/output/test.css"
        }, {
            output : "./tests/output/a",
            url    : transform
        });

        expect(dir("./tests/output")).toMatchSnapshot();
    });

    it("should copy referenced assets to the output", async () => {
        await url.process(fs.readFileSync("./tests/specimens/a/b/test.css"), {
            from : "./tests/specimens/a/b/test.css",
            to   : "./tests/output/test.css"
        }, {
            source : "./tests/specimens",
            output : "./tests/output",
            url    : transform
        });

        expect(dir("./tests/output")).toMatchSnapshot();
    });

    it("should update references to assets", async () => {
        const result = await url.process(fs.readFileSync("./tests/specimens/a/b/test.css"), {
            from : "./tests/specimens/a/b/test.css",
            to   : "./tests/output/test.css"
        }, {
            source : "./tests/specimens",
            output : "./tests/output",
            url    : transform
        });

        expect(result.css).toMatchSnapshot();
    });

    it("should ignore missing assets", async () => {
        const result = await url.process(fs.readFileSync("./tests/specimens/missing/missing.css"), {
            from : "./tests/specimens/missing/missing.css",
            to   : "./tests/output/test.css"
        }, {
            source : "./tests/specimens",
            output : "./tests/output",
            url    : transform
        });

        expect(result.css).toMatchSnapshot();
    });

    it("should ignore remote assets", async () => {
        const result = await url.process(fs.readFileSync("./tests/specimens/remote/remote.css"), {
            from : "./tests/specimens/remote/remote.css",
            to   : "./tests/output/test.css"
        }, {
            source : "./tests/specimens",
            output : "./tests/output",
            url    : transform
        });
        
        expect(result.css).toMatchSnapshot();
    });
    
    it("should remove existing files before copying", async () => {
        // Copy CSS as PNG so we can ensure the right file was used later
        cp.sync("./tests/specimens/a/b/test.css", "./tests/output/a/b/test.png");
        
        await url.process(fs.readFileSync("./tests/specimens/a/b/test.css"), {
            from : "./tests/specimens/a/b/test.css",
            to   : "./tests/output/test.css"
        }, {
            source : "./tests/specimens",
            url    : transform
        });

        // Make sure that the file is now the PNG, instead of the renamed CSS
        const source = fs.lstatSync("./tests/specimens/a/b/test.png");
        const result = fs.lstatSync("./tests/output/a/b/test.png");

        expect(result.size).toBe(source.size);
    });
});
