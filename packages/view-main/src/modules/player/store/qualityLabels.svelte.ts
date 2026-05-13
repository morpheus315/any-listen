const STORAGE_KEY = 'online_quality_cache'
const MAX_ENTRIES = 500

function loadFromStorage(): Map<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const entries = JSON.parse(raw) as [string, string][]
      return new Map(entries.slice(-MAX_ENTRIES))
    }
  } catch {}
  return new Map()
}

let saveTimer: ReturnType<typeof setTimeout> | null = null
function saveToStorage(map: Map<string, string>) {
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      const entries = [...map].slice(-MAX_ENTRIES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {}
  }, 500)
}

export const currentQualities = $state(loadFromStorage())
const state = $state({ version: 0 })

export function setQuality(songId: string, quality: string) {
  currentQualities.set(songId, quality)
  saveToStorage(currentQualities)
  state.version++
}

export function getQualityVersion() {
  return state.version
}
