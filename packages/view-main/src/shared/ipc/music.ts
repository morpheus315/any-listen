import { ipc } from './ipc'

export const getMusicUrl: AnyListen.IPC.ServerIPC['getMusicUrl'] = async (id) => {
  return ipc.getMusicUrl(id)
}
export const getMusicUrlCount: AnyListen.IPC.ServerIPC['getMusicUrlCount'] = async () => {
  return ipc.getMusicUrlCount()
}
export const clearMusicUrl: AnyListen.IPC.ServerIPC['clearMusicUrl'] = async () => {
  return ipc.clearMusicUrl()
}

export const getMusicPic: AnyListen.IPC.ServerIPC['getMusicPic'] = async (id) => {
  return ipc.getMusicPic(id)
}

export const getMusicLyric: AnyListen.IPC.ServerIPC['getMusicLyric'] = async (id) => {
  return ipc.getMusicLyric(id)
}
export const setMusicLyric: AnyListen.IPC.ServerIPC['setMusicLyric'] = async (id, name, singer, info) => {
  await ipc.setMusicLyric(id, name, singer, info)
}
export const getMusicLyricCount: AnyListen.IPC.ServerIPC['getMusicLyricCount'] = async () => {
  return ipc.getMusicLyricCount()
}
export const clearMusicLyric: AnyListen.IPC.ServerIPC['clearMusicLyric'] = async () => {
  return ipc.clearMusicLyric()
}

export const createLocalMusicInfos: AnyListen.IPC.ServerIPC['createLocalMusicInfos'] = async (paths) => {
  return ipc.createLocalMusicInfos(paths)
}

export const clearMusicOtherSource: AnyListen.IPC.ServerIPC['clearMusicOtherSource'] = async () => {
  return ipc.clearMusicOtherSource()
}
export const getMusicOtherSourceCount: AnyListen.IPC.ServerIPC['getMusicOtherSourceCount'] = async () => {
  return ipc.getMusicOtherSourceCount()
}
export const clearDislikeList: AnyListen.IPC.ServerIPC['clearDislikeList'] = async () => {
  return ipc.clearDislikeList()
}
export const getDislikeListCount: AnyListen.IPC.ServerIPC['getDislikeListCount'] = async () => {
  return ipc.getDislikeListCount()
}
export const clearPlayCount: AnyListen.IPC.ServerIPC['clearPlayCount'] = async () => {
  return ipc.clearPlayCount()
}
export const getPlayCountCount: AnyListen.IPC.ServerIPC['getPlayCountCount'] = async () => {
  return ipc.getPlayCountCount()
}
export const clearDownloadList: AnyListen.IPC.ServerIPC['clearDownloadList'] = async () => {
  return ipc.clearDownloadList()
}
export const getDownloadListCount: AnyListen.IPC.ServerIPC['getDownloadListCount'] = async () => {
  return ipc.getDownloadListCount()
}
