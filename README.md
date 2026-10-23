# pino-rotating-file-stream

[![NPM Package Version](https://img.shields.io/npm/v/pino-rotating-file-stream)](https://www.npmjs.com/package/pino-rotating-file-stream)

## Description

This module provides a **transport** for *pino* to automatically rotates logs. Under the hood, it uses [rotating-file-stream](https://www.npmjs.com/package/rotating-file-stream) even though some fields have been added to the default *Options*.

## CLI
The current version of this packages has only support for the module usage as described in the [Programmatic Integration](#programmatic-integration) section. This feature will be added in next versions of the package.
For now you can rely on [@vrbo/pino-rotating-file](https://www.npmjs.com/package/@vrbo/pino-rotating-file) for CLI integration.
## Programmatic Integration
Install ``pino-rotating-file-stream`` alongside ``pino`` and set the transport to ``pino-rotating-file-stream``:

```js
const pino = require('pino')
const logger = pino({
  transport: {
    target: 'pino-rotating-file-stream',
    options: {
      filename: 'app.log', // Required
      path: './logs', // Required
    },
  },
})

logger.info('hi')
```

See also the example in the ``examples`` folder.

### Options
The options are the same provided by ``rotating-file-stream`` except for the required ``filename`` and ``path``. Options are passed through without wrapper defaults. In particular, size rotation, interval rotation, rotated-file size limits, and compression are disabled unless configured; see ``rotating-file-stream`` for its defaults and option details:
```js
{
  filename: string; // Specifies the name of the file. Required.
  path: string // Specifies the base path for files. Required.
  size: string // Specifies the file size to rotate the file.
  maxSize: string // Specifies the maximum size of rotated files to keep.
  interval: string // Specifies the time interval to rotate the file.
  compress: boolean | string | Function // Specifies compression method of rotated files.
  encoding: string // Specifies the default encoding. Default: 'utf8'.
  history: string // Specifies the history filename. Default: null.
  immutable: boolean // Never mutate file names. Default: null.
  initialRotation: boolean // Initial rotation based on not-rotated file timestamp. Default: null.
  intervalBoundary: boolean // Makes rotated file name with lower boundary of rotation period. Default: null.
  maxFiles: number // Specifies the maximum number of rotated files to keep. Default: null.
  mode: number // Proxied to fs.createWriteStream. Default: 0o666.
  omitExtension: // boolean Omits the .gz extension from compressed rotated files. Default: null.
  rotate: number // Enables the classical UNIX logrotate behaviour. Default: null.
  teeToStdout: boolean // Writes file content to stdout as well. Default: null.
}
```

## License

[MIT](./LICENSE) License © 2023 [Angelo Delicato](https://github.com/thelicato)
