import { promises as fs } from 'fs';

export async function readJSON(path) {
  const data = await fs.readFile(path, 'utf8');
  return JSON.parse(data);
}

export async function writeJSON(path, data) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}
