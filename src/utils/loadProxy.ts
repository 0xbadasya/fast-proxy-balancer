import { readFile } from 'fs/promises';

/**
 * Loads proxies from a file. Lines starting with "#" are ignored.
 * @param filePath - Path to the proxy list file
 * @returns An array of proxy strings (e.g., IP:Port)
 */
export async function loadProxiesFromFile(filePath: string): Promise<string[]> {
  try {
    const data = await readFile(filePath, 'utf8');
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  } catch (error: any) {
    console.error(`Error reading proxy file: ${error.message}`);
    return [];
  }
}
