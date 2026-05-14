import { dbPrepare } from '../../db'

export interface MusicUrlInfo {
  id: string
  url: string
  quality: string
}

export const createQueryStatement = () => {
  return dbPrepare<string, MusicUrlInfo>(`
    SELECT "url", "quality"
    FROM "main"."music_url"
    WHERE "id"=?
    `)
}

export const createInsertStatement = () => {
  return dbPrepare<MusicUrlInfo>(`
    INSERT INTO "main"."music_url" ("id", "url", "quality")
    VALUES (@id, @url, @quality)`)
}

export const createClearStatement = () => {
  return dbPrepare(`
    DELETE FROM "main"."music_url"
  `)
}

export const createDeleteStatement = () => {
  return dbPrepare<string>(`
    DELETE FROM "main"."music_url"
    WHERE "id"=?
  `)
}

export const createUpdateStatement = () => {
  return dbPrepare<MusicUrlInfo>(`
    UPDATE "main"."music_url"
    SET "url"=@url, "quality"=@quality
    WHERE "id"=@id`)
}

export const createCountStatement = () => {
  return dbPrepare<[], { count: number }>('SELECT COUNT(*) as count FROM "main"."music_url"')
}
