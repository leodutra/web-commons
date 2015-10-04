#web-commons

Collection of useful JavaScript snippets, integrated in one open source lib.

*jQuery 1.5+ required (1.9+ recommended)*

## Download Releases
https://github.com/LeoDutra/web-commons/releases

## Documentation

There's no reference yet.

But you can just execute on your console:

```js
web.typify(web);  // show property/function list, breaking lines
```

## Logging & Debugging

You can turn debug mode on and log:

```js
web.debug = true; // debug mode on
web.log('something', 'another thing', 123);
```

**Import `web-commons.logger.js` after `web-commons.js` to use the logger addon (IE6+)**

If you don't include the logger addon, it will fallback and use the built-in console of the web browser (IE 8+, Ch, FF, Op, Saf).
