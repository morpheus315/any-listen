import type Database from 'better-sqlite3'
import { DB_VERSION } from './tables'

const migrateV2 = (db: Database.Database) => {
  const hasColumn = db
    .prepare(`SELECT COUNT(*) as count FROM pragma_table_info('music_url') WHERE name='quality'`)
    .get() as { count: number }
  if (!hasColumn.count) {
    db.exec('ALTER TABLE "main"."music_url" ADD COLUMN "quality" TEXT NOT NULL DEFAULT ""')
  }
}

const migrateV3 = (db: Database.Database) => {
  db.exec('DELETE FROM "main"."music_url"')
  db.exec('DELETE FROM "main"."lyric" WHERE "type" = \'raw\'')
}

const migrateV4 = (db: Database.Database) => {
  // Encode bare songId → source_songId for online music in playlists
  interface Row { id: string, list_id: string, meta: string }
  const rows = db.prepare('SELECT "id", "list_id", "meta" FROM "main"."my_list_music_info" WHERE "is_local" = 0').all() as Row[]
  const updateId = db.prepare('UPDATE "main"."my_list_music_info" SET "id" = @newId WHERE "id" = @id AND "list_id" = @listId')
  const updateOrder = db.prepare('UPDATE "main"."my_list_music_info_order" SET "music_id" = @newId WHERE "music_id" = @id AND "list_id" = @listId')

  db.transaction(() => {
    for (const row of rows) {
      let meta: Record<string, unknown>
      try { meta = JSON.parse(row.meta) } catch { continue }
      const source = meta.source as string | undefined
      if (!source || row.id.startsWith(`${source}_`)) continue
      const newId = `${source}_${row.id}`
      updateId.run({ newId, id: row.id, listId: row.list_id })
      updateOrder.run({ newId, id: row.id, listId: row.list_id })
    }
  })()

  // Clear play queue (temporary, will be rebuilt)
  db.exec('DELETE FROM "main"."play_list_music_info"')
}

export default (db: Database.Database) => {
  const dbVersion = (db.prepare('SELECT "field_value" FROM "main"."metadata" WHERE "field_name" = ?').get('db_version') as { field_value: string }).field_value
  switch (dbVersion) {
    case '1':
      migrateV2(db)
      // fall through
    case '2':
      migrateV3(db)
      // fall through
    case '3':
      migrateV4(db)
      db.prepare('UPDATE "main"."metadata" SET "field_value"=@value WHERE "field_name"=@name').run({ name: 'db_version', value: DB_VERSION })
      break
  }
}
