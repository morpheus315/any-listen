import type { IPCSocket } from '@/preload/ws'

// 暴露给前端的方法
export const createClientMusic = (ipcSocket: IPCSocket) => {
  return {
    async getMusicUrl(id) {
      return ipcSocket.remote.getMusicUrl(id)
    },
    async getMusicUrlCount() {
      return ipcSocket.remote.getMusicUrlCount()
    },
    async clearMusicUrl() {
      return ipcSocket.remote.clearMusicUrl()
    },

    async getMusicPic(info) {
      return ipcSocket.remote.getMusicPic(info)
    },

    async getMusicLyric(id) {
      return ipcSocket.remote.getMusicLyric(id)
    },
    async setMusicLyric(id, name, singer, info) {
      return ipcSocket.remote.setMusicLyric(id, name, singer, info)
    },
    async getMusicLyricCount() {
      return ipcSocket.remote.getMusicLyricCount()
    },
    async clearMusicLyric() {
      return ipcSocket.remote.clearMusicLyric()
    },

    async createLocalMusicInfos(paths) {
      return ipcSocket.remote.createLocalMusicInfos(paths)
    },

    async clearMusicOtherSource() {
      return ipcSocket.remote.clearMusicOtherSource()
    },
    async getMusicOtherSourceCount() {
      return ipcSocket.remote.getMusicOtherSourceCount()
    },
    async clearDislikeList() {
      return ipcSocket.remote.clearDislikeList()
    },
    async getDislikeListCount() {
      return ipcSocket.remote.getDislikeListCount()
    },
    async clearPlayCount() {
      return ipcSocket.remote.clearPlayCount()
    },
    async getPlayCountCount() {
      return ipcSocket.remote.getPlayCountCount()
    },
    async clearDownloadList() {
      return ipcSocket.remote.clearDownloadList()
    },
    async getDownloadListCount() {
      return ipcSocket.remote.getDownloadListCount()
    },
  } satisfies Partial<AnyListen.IPC.ServerIPC>
}
