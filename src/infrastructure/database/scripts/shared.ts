import 'dotenv/config';

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Pool } from 'pg';

import { getDatabaseConfig } from '../database.config';

export async function createPool(): Promise<Pool> {
  const pool = new Pool(getDatabaseConfig());
  await pool.query('SELECT 1');
  return pool;
}

export async function readSqlFiles(directory: string): Promise<Array<{ name: string; sql: string }>> {
  const entries = await readdir(directory);
  const sqlFiles = entries.filter((entry) => entry.endsWith('.sql')).sort();

  return Promise.all(
    sqlFiles.map(async (name) => ({
      name,
      sql: await readFile(join(directory, name), 'utf8'),
    })),
  );
}
