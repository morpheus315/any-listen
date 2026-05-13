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

export async function apiRequest(params: Record<string, string | number | undefined | null>): Promise<any> {
  const url = buildUrl(API_BASE, params)

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

  return response.json()
}

export function pickFirst<T>(result: T | T[]): T {
  return Array.isArray(result) ? result[0] : result
}
