const STORAGE_KEY = 'online_quality_cache'
const MAX_ENTRIES = 500

function loadFromStorage(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const entries = JSON.parse(raw) as [string, string][]
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {}
  }, 500)
}

let cache = $state<Record<string, string>>(loadFromStorage())

export function setQuality(songId: string, quality: string) {
  cache = { ...cache, [songId]: quality }
  saveToStorage(cache)
}

export function getQuality(songId: string): string | undefined {
  return cache[songId]
}
