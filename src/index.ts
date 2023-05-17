import { createStream, Options } from 'rotating-file-stream';

export interface PinoRotatingFileStreamOptions extends Options {
  filename: string;
  path: string;
}

export default (options: PinoRotatingFileStreamOptions) => {
  const { filename, size, maxSize, interval, compress, path, ...otherOptions } = options;
  return createStream(filename, {
    ...otherOptions,
    // Set some default values
    size: size || '100M',
    maxSize: maxSize || '1G',
    interval: interval || '7d',
    compress: compress || 'gzip',
    path: path,
  });
};
