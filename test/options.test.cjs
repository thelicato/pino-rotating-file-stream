const assert = require('node:assert/strict');
const { once } = require('node:events');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, sep } = require('node:path');
const { test } = require('node:test');

const cjsFactory = require('../dist/cjs/index.js').default;

async function withTempPath(callback) {
  const path = `${mkdtempSync(join(tmpdir(), 'pino-rfs-'))}${sep}`;
  try {
    await callback(path);
  } finally {
    rmSync(path, { recursive: true, force: true });
  }
}

async function createAndClose(factory, filename, options) {
  const stream = factory({ filename, ...options });
  const opened = once(stream, 'open');
  const closed = once(stream, 'close');

  try {
    const [openedFilename] = await opened;
    return { stream, openedFilename, closed };
  } catch (error) {
    stream.destroy();
    await closed;
    throw error;
  }
}

async function testFactory(t, factory) {
  await t.test('uses the supplied filename and directory', async () => {
    await withTempPath(async path => {
      const { stream, openedFilename, closed } = await createAndClose(factory, 'app.log', { path });
      assert.equal(openedFilename, join(path, 'app.log'));
      assert.equal(stream.options.path, path);
      assert.equal(stream.options.size, undefined);
      assert.equal(stream.options.maxSize, undefined);
      assert.equal(stream.options.interval, undefined);
      assert.equal(stream.options.compress, undefined);
      stream.destroy();
      await closed;
    });
  });

  await t.test('passes every rotating-file-stream option through unchanged', async () => {
    await withTempPath(async path => {
      const compressor = (source, destination) => `${source} | gzip > ${destination}`;
      const options = {
        path,
        compress: compressor,
        encoding: 'utf8',
        history: 'history.txt',
        immutable: false,
        initialRotation: false,
        interval: '1d',
        intervalBoundary: true,
        intervalUTC: true,
        maxFiles: 4,
        maxSize: '1G',
        mode: 0o600,
        omitExtension: true,
        size: '10M',
        teeToStdout: true,
      };
      const input = { ...options };
      const { stream, openedFilename, closed } = await createAndClose(factory, 'app.log', options);

      assert.ok(openedFilename.startsWith(path));
      assert.ok(openedFilename.endsWith('app.log'));
      const normalizedOptions = { ...options };
      normalizedOptions.history = join(path, 'history.txt');
      normalizedOptions.interval = { num: 1, unit: 'd' };
      normalizedOptions.maxSize = 1073741824;
      normalizedOptions.size = 10485760;
      assert.deepEqual(stream.options, normalizedOptions);
      assert.deepEqual(options, input);
      stream.destroy();
      await closed;
    });
  });

  await t.test('preserves explicit false values, including compression off', async () => {
    await withTempPath(async path => {
      const options = {
        path,
        compress: false,
        immutable: false,
        initialRotation: false,
        intervalBoundary: false,
        intervalUTC: false,
        omitExtension: false,
        teeToStdout: false,
      };
      const { stream, closed } = await createAndClose(factory, 'app.log', options);

      assert.equal(stream.options.compress, false);
      stream.destroy();
      await closed;
    });
  });

  await t.test('passes classical rotation mode through', async () => {
    await withTempPath(async path => {
      const { stream, closed } = await createAndClose(factory, 'app.log', { path, rotate: 3 });

      assert.equal(stream.options.rotate, 3);
      stream.destroy();
      await closed;
    });
  });

  await t.test('passes immutable interval rotation through', async () => {
    await withTempPath(async path => {
      const { stream, openedFilename, closed } = await createAndClose(factory, 'app.log', {
        path,
        interval: '1d',
        immutable: true,
      });

      assert.equal(stream.options.immutable, true);
      assert.ok(openedFilename.startsWith(path));
      assert.ok(openedFilename.endsWith('app.log'));
      stream.destroy();
      await closed;
    });
  });
}

test('CommonJS build', async t => {
  await testFactory(t, cjsFactory);
});

test('ESM build', async t => {
  const esmFactory = (await import('../dist/mjs/index.js')).default;
  await testFactory(t, esmFactory);
});
