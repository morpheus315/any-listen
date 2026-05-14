import { getLyricInfo, getMusicPic, getMusicUrl } from '@/app/modules/music'
import { workers } from '@/app/worker'

import type { ExposeClientFunctions } from '.'

// 暴露给前端的方法
export const createExposeMusic = () => {
  return {
    async getMusicUrl(event, info) {
      return getMusicUrl(info)
    },
    async getMusicUrlCount(event) {
      return workers.dbService.musicUrlCount()
    },
    async clearMusicUrl(event) {
      return workers.dbService.musicUrlClear()
    },

    async getMusicPic(event, info) {
      return getMusicPic(info)
    },

    async getMusicLyric(event, info) {
      return getLyricInfo(info)
    },
    async setMusicLyric(event, id, name, singer, info) {
      // TODO
      // return workers.dbService.rawLyricSave(id, info)
    },
    async getMusicLyricCount(event) {
      return workers.dbService.rawLyricCount()
    },
    async clearMusicLyric(event) {
      return workers.dbService.rawLyricClear()
    },
    async createLocalMusicInfos(event, paths) {
      return workers.utilService.createLocalMusicInfos(paths, true)
    },

    async clearMusicOtherSource(event) {
      return workers.dbService.musicInfoOtherSourceClear()
    },
    async getMusicOtherSourceCount(event) {
      return workers.dbService.musicInfoOtherSourceCount()
    },
    async clearDislikeList(event) {
      return workers.dbService.dislikeInfoClear()
    },
    async getDislikeListCount(event) {
      return workers.dbService.dislikeListCount()
    },
    async clearPlayCount(event) {
      return workers.dbService.playCountClear()
    },
    async getPlayCountCount(event) {
      return workers.dbService.playCountCount()
    },
    async clearDownloadList(event) {
      return workers.dbService.downloadInfoClear()
    },
    async getDownloadListCount(event) {
      return workers.dbService.downloadInfoCount()
    },
  } satisfies Partial<ExposeClientFunctions>
}
