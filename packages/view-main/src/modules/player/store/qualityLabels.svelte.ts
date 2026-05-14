import { buildSongCacheKey } from '@any-listen/common/tools'

const STORAGE_KEY = 'online_quality_cache'
const CACHE_VERSION = 2
const MAX_ENTRIES = 500

function loadFromStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      // v2 format: { version, entries: [[key, value], ...] }
      // v1 format: [[key, value], ...] (no version, no source prefix)
      if (data.version !== CACHE_VERSION) return {}
      const entries = data.entries as [string, string][]
      return Object.fromEntries(entries.slice(-MAX_ENTRIES))
    }
  } catch {}
  return {}
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
function saveToStorage(cache: Record<string, string>) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      const entries = Object.entries(cache).slice(-MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: CACHE_VERSION, entries }))
    } catch {}
  }, 500)
}

let cache = $state<Record<string, string>>(loadFromStorage())

export function setQuality(musicInfo: AnyListen.Music.MusicInfo, quality: string) {
  const key = buildSongCacheKey(musicInfo)
  cache = { ...cache, [key]: quality }
  saveToStorage(cache)
}

export function getQuality(musicInfo: AnyListen.Music.MusicInfo): string | undefined {
  return cache[buildSongCacheKey(musicInfo)]
}
