postcss-url-folders   [![NPM Version](https://img.shields.io/npm/v/postcss-url-folders.svg)](https://www.npmjs.com/package/postcss-url-folders) [![NPM License](https://img.shields.io/npm/l/postcss-url-folders.svg)](https://www.npmjs.com/package/postcss-url-folders) [![NPM Downloads](https://img.shields.io/npm/dm/postcss-url-folders.svg)](https://www.npmjs.com/package/postcss-url-folders)
===================

Small helper transform for [`postcss-url`](https://github.com/postcss/postcss-url) to maintain folder structure while copying assets around.

:warning: Requires Node > `8.5.0` due to usage of `fs.copyFile()` :warning:

## Installation

`npm install postcss-url postcss-url-folders -D`


## Usage

```js
const fs = require("fs");

const postcss = require("postcss");
const url     = require("postcss-url");
const folders = require("postcss-url-folders");

const css = fs.readFileSync("./src/input.css", "utf8");

const processor = postcss([
    url({
        url    : folders,
        source : "./src",
        output : "./dist"
    })
]);

processor.process(css, {
    from : "./src/input.css",
    to   : "./dist/output.css"
});
```

## Example

The source folder structure for static assets

```
├───src
    │   input.css
    │
    ├───components
    │   └───button
    │           background.png
    │           button.css
    │           icons.svg
    │
    └───site
            header.png
            site.css
```

will be maintained in the output location

```
├───dist
    │   output.css
    │
    ├───components
    │   └───button
    │           background.png
    │           icons.svg
    │
    └───site
            header.png
```

along with updating references to copied files as necessary.

## Options

### `source`

Root location to reference all assets from. Defaults to the `from` parameter provided by `postcss` but that often isn't very useful. In the [Example](#example) above you would set it to `"./src"`.

### `output`

Directory to copy all assets to. Defaults to the directory of the `to` parameter provided by `postcss`. In the [Example](#example) above it could have been set to `"./dist"` but would have chosen the directory correctly by default.
