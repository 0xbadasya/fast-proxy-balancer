import { appendFile } from 'fs';
import { join } from 'path';

const LOG_FILE = join(process.cwd(), 'proxy.log');

type LogType = 'info' | 'error' | 'warn' | 'debug';

/**
 * Logs a message to console and to a log file.
 * @param message - The message to log
 * @param type - Type of log (info, error, etc.)
 */
export function log(message: string, type: LogType = 'info'): void {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;

  // Console output
  if (type === 'error') {
    console.error(formattedMessage);
  } else {
    console.log(formattedMessage);
  }

  // Write to file
  appendFile(LOG_FILE, formattedMessage + '\n', err => {
    if (err) console.error(`[LOGGER ERROR] Failed to write to the log: ${err.message}`);
  });
}
