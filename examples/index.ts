import pino from 'pino'
import { PinoRotatingFileStreamOptions } from '../src'

// Run this file with 'npx ts-node index.ts'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const transport = pino.transport<PinoRotatingFileStreamOptions>({
  target: '../dist/cjs/index.js', // 👈 Replace this with "pino-rotating-file-stream"
  options: {
    filename: 'app.log',
    path: './logs',
    interval: '1s',
  },
})

const logger = pino(transport)

async function main() {
  logger.warn({ warning: '1' });
  await sleep(1000);
  logger.error({ error: '2' });
  await sleep(1000);
  logger.info({ info: '3' });
}

main()