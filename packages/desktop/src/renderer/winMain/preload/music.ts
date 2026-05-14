import type { MainCall } from '.'

// 暴露给前端的方法
export const createClientMusic = (main: MainCall) => {
  return {
    async getMusicUrl(id) {
      return main.getMusicUrl(id)
    },
    async getMusicUrlCount() {
      return main.getMusicUrlCount()
    },
    async clearMusicUrl() {
      return main.clearMusicUrl()
    },

    async getMusicPic(info) {
      return main.getMusicPic(info)
    },

    async getMusicLyric(id) {
      return main.getMusicLyric(id)
    },
    async setMusicLyric(id, name, singer, info) {
      return main.setMusicLyric(id, name, singer, info)
    },
    async getMusicLyricCount() {
      return main.getMusicLyricCount()
    },
    async clearMusicLyric() {
      return main.clearMusicLyric()
    },

    async createLocalMusicInfos(paths) {
      return main.createLocalMusicInfos(paths)
    },

    async clearMusicOtherSource() {
      return main.clearMusicOtherSource()
    },
    async getMusicOtherSourceCount() {
      return main.getMusicOtherSourceCount()
    },
    async clearDislikeList() {
      return main.clearDislikeList()
    },
    async getDislikeListCount() {
      return main.getDislikeListCount()
    },
    async clearPlayCount() {
      return main.clearPlayCount()
    },
    async getPlayCountCount() {
      return main.getPlayCountCount()
    },
    async clearDownloadList() {
      return main.clearDownloadList()
    },
    async getDownloadListCount() {
      return main.getDownloadListCount()
    },
  } satisfies Partial<AnyListen.IPC.ServerIPC>
}
