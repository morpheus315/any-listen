import { buildSongCacheKey } from '@any-listen/common/tools'

const STORAGE_KEY = 'song_meta_cache'
const CACHE_VERSION = 2
const MAX_ENTRIES = 500

interface CachedMeta {
  picUrl?: string
  interval?: string
}

function loadCache(): Record<string, CachedMeta> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.version !== CACHE_VERSION) return {}
      const entries = data.entries as [string, CachedMeta][]
      return Object.fromEntries(entries.slice(-MAX_ENTRIES))
    }
  } catch {}
  return {}
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
function saveCache(cache: Record<string, CachedMeta>) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      const entries = Object.entries(cache).slice(-MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CACHE_VERSION, entries }))
    } catch {}
  }, 500)
}

const songMetaCache = $state<Record<string, CachedMeta>>(loadCache())

function cacheKey(musicInfo: AnyListen.Music.MusicInfo): string {
  return buildSongCacheKey(musicInfo)
}

export function cacheSongPic(musicInfo: AnyListen.Music.MusicInfo, picUrl: string) {
  const key = cacheKey(musicInfo)
  songMetaCache[key] = { ...songMetaCache[key], picUrl }
  saveCache(songMetaCache)
}

export function cacheSongInterval(musicInfo: AnyListen.Music.MusicInfo, interval: string) {
  const key = cacheKey(musicInfo)
  songMetaCache[key] = { ...songMetaCache[key], interval }
  saveCache(songMetaCache)
}

export function getSongMeta(musicInfo: AnyListen.Music.MusicInfo): CachedMeta | undefined {
  return songMetaCache[cacheKey(musicInfo)]
}

export function clearAllMeta() {
  for (const key of Object.keys(songMetaCache)) {
    delete songMetaCache[key]
  }
  saveCache(songMetaCache)
}

export function getMetaCount(): number {
  return Object.keys(songMetaCache).length
}

export { songMetaCache }
