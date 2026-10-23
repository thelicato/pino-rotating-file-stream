import { createStream, Options } from 'rotating-file-stream';

export interface PinoRotatingFileStreamOptions extends Options {
  filename: string;
  path: string;
}

export default (options: PinoRotatingFileStreamOptions) => {
  const { filename, path, ...otherOptions } = options;
  return createStream(filename, {
    ...otherOptions,
    path: path,
  });
};
