import type Database from 'better-sqlite3'
import { DB_VERSION } from './tables'

const migrateV2 = (db: Database.Database) => {
  // Add quality column to music_url for storing actual audio quality
  const hasColumn = db
    .prepare(`SELECT COUNT(*) as count FROM pragma_table_info('music_url') WHERE name='quality'`)
    .get() as { count: number }
  if (!hasColumn.count) {
    db.exec('ALTER TABLE "main"."music_url" ADD COLUMN "quality" TEXT NOT NULL DEFAULT ""')
  }
}

export default (db: Database.Database) => {
  const dbVersion = (db.prepare('SELECT "field_value" FROM "main"."metadata" WHERE "field_name" = ?').get('db_version') as { field_value: string }).field_value
  switch (dbVersion) {
    case '1':
      migrateV2(db)
      db.prepare('UPDATE "main"."metadata" SET "field_value"=@value WHERE "field_name"=@name').run({ name: 'db_version', value: DB_VERSION })
      break
  }
}
