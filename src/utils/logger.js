import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'proxy.log'); // File for logs

// Function for output to the console and (optionally) to a file
function log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${type.toUpperCase()}] ${message}`;

    // Output to the console
    if (type === 'error') {
        console.error(formattedMessage);
    } else {
        console.log(formattedMessage);
    }

    // Writing to a file
    fs.appendFile(LOG_FILE, formattedMessage + '\n', (err) => {
        if (err) console.error(`[LOGGER ERROR] Failed to write to the log: ${err.message}`);
    });
}

export { log };
