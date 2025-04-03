import fs from 'fs/promises';

async function loadProxiesFromFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#')); 
  } catch (error) {
    console.error(`Error reading proxy file: ${error.message}`);
    return [];
  }
}

export { loadProxiesFromFile };
