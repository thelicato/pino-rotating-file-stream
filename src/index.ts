import { createStream, Options } from 'rotating-file-stream';

export interface IPinoRotatingFileStreamOptions extends Options {
  filename: string;
  path: string;
}

export default (options: IPinoRotatingFileStreamOptions) => {
  const { filename, size, maxSize, interval, compress, path } = options;
  return createStream(filename, {
    ...options,
    // Set some default values
    size: size || '100M',
    maxSize: maxSize || '1G',
    interval: interval || '7d',
    compress: compress || 'gzip',
    path: path,
  });
};
