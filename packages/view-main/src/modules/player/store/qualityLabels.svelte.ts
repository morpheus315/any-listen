export const currentQualities = $state(new Map<string, string>())

const state = $state({ version: 0 })

export function setQuality(songId: string, quality: string) {
  currentQualities.set(songId, quality)
  state.version++
  console.log('[quality] set:', songId, '→', quality, 'version:', state.version)
}

export function getQualityVersion() {
  return state.version
}
