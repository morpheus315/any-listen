const API_BASE = 'https://music-api.gdstudio.xyz/api.php'

export const SOURCE_MAP: Record<string, string> = {
  'gd-netease': 'netease',
  'gd-kuwo': 'kuwo',
  'gd-tencent': 'tencent',
  'gd-bilibili': 'bilibili',
  'gd-tidal': 'tidal',
  'gd-qobuz': 'qobuz',
  'gd-joox': 'joox',
  'gd-apple': 'apple',
  'gd-ytmusic': 'ytmusic',
  'gd-spotify': 'spotify',
}

export const QUALITY_BR_MAP: Record<string, number> = {
  flac24bit: 999,
  flac: 740,
  '320k': 320,
  '192k': 192,
  '128k': 128,
}

export const BR_QUALITY_MAP: Record<number, string> = {
  999: 'flac24bit',
  740: 'flac',
  320: '320k',
  192: '192k',
  128: '128k',
}

export function getApiSource(sourceId: string): string {
  return SOURCE_MAP[sourceId] || 'netease'
}

export function buildUrl(base: string, params: Record<string, string | number | undefined | null>): string {
  const parts: string[] = []
  for (const key of Object.keys(params)) {
    const value = params[key]
    if (value != null && value !== '') {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    }
  }
  return parts.length ? `${base}?${parts.join('&')}` : base
}

function isEmptyResponse(data: unknown): boolean {
  if (data == null) return true
  if (Array.isArray(data)) return data.length === 0
  if (typeof data === 'object') {
    if ('url' in data) return false
    if ('lyric' in data || 'tlyric' in data) return false
    if (Array.isArray((data as Record<string, unknown>).list)) {
      return ((data as Record<string, unknown>).list as unknown[]).length === 0
    }
    if (Array.isArray((data as Record<string, unknown>).data)) {
      return ((data as Record<string, unknown>).data as unknown[]).length === 0
    }
  }
  return false
}

const MAX_RETRIES = 10
const RETRY_DELAY = 1000

export async function apiRequest(
  params: Record<string, string | number | undefined | null>,
  retryOnEmpty = true
): Promise<any> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      console.log(`[gdstudio] retry ${attempt}/${MAX_RETRIES} after ${RETRY_DELAY}ms`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
    }

    const url = buildUrl(API_BASE, params)
    console.log(`[gdstudio] request: ${url}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'any-listen/1.0',
        Accept: 'application/json',
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`API request failed with status ${response.status}: ${text}`)
    }

    const data = await response.json()

    if (!retryOnEmpty || !isEmptyResponse(data)) {
      const summary = typeof data === 'object' && data != null
        ? (Array.isArray(data) ? `array[${data.length}]` : `keys:${Object.keys(data).join(',')}`)
        : typeof data
      console.log(`[gdstudio] response: status=${response.status} type=${summary}`)
      return data
    }

    if (attempt < MAX_RETRIES) {
      console.log(`[gdstudio] empty response, will retry`)
    }
  }

  return null
}

export function pickFirst<T>(result: T | T[]): T {
  return Array.isArray(result) ? result[0] : result
}
