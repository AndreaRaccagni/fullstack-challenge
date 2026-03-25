import { join } from 'node:path';

import { createPool, readSqlFiles } from './shared';

async function runMigrations(): Promise<void> {
  const pool = await createPool();

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await pool.query<{ filename: string }>(
      'SELECT filename FROM schema_migrations',
    );
    const applied = new Set(appliedResult.rows.map((row) => row.filename));

    const files = await readSqlFiles(join(__dirname, '..', 'migrations'));

    for (const file of files) {
      if (applied.has(file.name)) {
        continue;
      }

      const client = await pool.connect();

      try {
        await client.query('BEGIN');
        await client.query(file.sql);
        await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file.name]);
        await client.query('COMMIT');
        console.log(`Applied migration: ${file.name}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    }
  } finally {
    await pool.end();
  }
}

void runMigrations();
