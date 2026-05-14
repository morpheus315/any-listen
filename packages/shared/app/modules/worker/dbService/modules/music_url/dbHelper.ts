import { getDB } from '../../db'
import {
  type MusicUrlInfo,
  createClearStatement,
  createCountStatement,
  createDeleteStatement,
  createInsertStatement,
  createQueryStatement,
} from './statements'

export const queryMusicUrl = (id: string): MusicUrlInfo | null => {
  const queryStatement = createQueryStatement()
  return queryStatement.get(id) ?? null
}

export const inertMusicUrl = (urlInfo: MusicUrlInfo[]) => {
  const db = getDB()
  const insertStatement = createInsertStatement()
  db.transaction((urlInfo: MusicUrlInfo[]) => {
    for (const info of urlInfo) insertStatement.run(info)
  })(urlInfo)
}

export const deleteMusicUrl = (ids: string[]) => {
  const db = getDB()
  const deleteStatement = createDeleteStatement()
  db.transaction((ids: string[]) => {
    for (const id of ids) deleteStatement.run(id)
  })(ids)
}

export const clearMusicUrl = () => {
  const clearStatement = createClearStatement()
  clearStatement.run()
}

export const countMusicUrl = () => {
  const countStatement = createCountStatement()
  return countStatement.get()!.count
}
