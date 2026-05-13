const STORAGE_KEY = 'song_meta_cache'
const MAX_ENTRIES = 500

interface CachedMeta {
  picUrl?: string
  interval?: string
}

function loadCache(): Map<string, CachedMeta> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const entries = JSON.parse(raw) as [string, CachedMeta][]
      return new Map(entries.slice(-MAX_ENTRIES))
    }
  } catch {}
  return new Map()
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
function saveCache(map: Map<string, CachedMeta>) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      const entries = [...map].slice(-MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {}
  }, 500)
}

export const songMetaCache = $state(loadCache())

export function cacheSongPic(songId: string, picUrl: string) {
  const meta = songMetaCache.get(songId) || {}
  meta.picUrl = picUrl
  songMetaCache.set(songId, meta)
  saveCache(songMetaCache)
}

export function cacheSongInterval(songId: string, interval: string) {
  const meta = songMetaCache.get(songId) || {}
  meta.interval = interval
  songMetaCache.set(songId, meta)
  saveCache(songMetaCache)
}
