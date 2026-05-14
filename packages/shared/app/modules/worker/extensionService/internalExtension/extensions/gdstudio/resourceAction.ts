import { apiRequest, getApiSource, BR_QUALITY_MAP, QUALITY_BR_MAP, pickFirst } from './utils'

// Cache cover URLs so repeated requests return instantly
const picCache = new Map<string, string>()
const lyricCache = new Map<string, { lyric: string; tlyric: string | null }>()

function buildMusicInfo(item: Record<string, unknown>, source: string): AnyListen.Music.MusicInfoOnline {
  return {
    id: String(item.id),
    name: (item.name as string) || 'Unknown',
    singer: item.artist ? String(item.artist) : '',
    interval: null,
    isLocal: false,
    meta: {
      musicId: String(item.id),
      albumName: (item.album as string) || '',
      picUrl: null,
      source,
      qualitys: {},
      createTime: 0,
      updateTime: 0,
      posTime: 0,
      pic_id: item.pic_id as string | undefined,
      lyric_id: item.lyric_id as string | undefined,
    },
  }
}

export const resourceActions: Partial<AnyListen.IPCExtension.ResourceAction> = {
  async musicSearch(params) {
    const apiSource = getApiSource(params.source)
    const page = params.page || 1
    const limit = params.limit || 20

    const result = await apiRequest({
      types: 'search',
      source: apiSource,
      name: params.name,
      count: limit,
      pages: page,
    })

    if (!result) {
      console.log('[gdstudio] search returned null after retries')
      return { list: [], total: 0, page, limit }
    }

    const items: Record<string, unknown>[] = Array.isArray(result) ? result : (result.data || result.list || [])
    const list = items.map((item) => buildMusicInfo(item, params.source))

    return {
      list,
      total: result.total != null ? (result.total as number) : page * limit + (items.length === limit ? limit : 0),
      page,
      limit,
    }
  },

  async musicUrl(params) {
    const musicInfo = params.musicInfo
    const apiSource = getApiSource(params.source)

    let br = 320
    if (params.quality && QUALITY_BR_MAP[params.quality]) {
      br = QUALITY_BR_MAP[params.quality]
    }

    console.log(`[gdstudio] musicUrl: song="${musicInfo.name}" id=${musicInfo.meta.musicId} requestedQuality=${params.quality ?? 'none'} requestBr=${br}`)

    const result = await apiRequest({
      types: 'url',
      source: apiSource,
      id: musicInfo.meta.musicId,
      br,
    })

    const data = pickFirst(result) as Record<string, unknown> | undefined
    if (!data || !data.url) {
      throw new Error(`No playable URL returned from API: ${JSON.stringify(result)}`)
    }

    const quality = BR_QUALITY_MAP[data.br as number] || '128k'
    console.log(`[gdstudio] musicUrl result: actualBr=${data.br as number} actualQuality=${quality}`)

    return {
      url: data.url as string,
      quality,
    }
  },

  async musicPic(params) {
    const musicInfo = params.musicInfo
    const apiSource = getApiSource(params.source)

    const picId = ((musicInfo.meta as Record<string, unknown>).pic_id || musicInfo.meta.musicId) as string
    const cacheKey = `${apiSource}_${picId}`

    // Return cached URL immediately — no API call needed
    const cached = picCache.get(cacheKey)
    if (cached) return cached

    const result = await apiRequest({
      types: 'pic',
      source: apiSource,
      id: picId,
      size: 500,
    })

    const data = pickFirst(result) as Record<string, unknown> | undefined
    if (!data || !data.url) {
      throw new Error('No album art URL returned from API')
    }

    const url = data.url as string
    picCache.set(cacheKey, url)
    return url
  },

  async musicLyric(params) {
    const musicInfo = params.musicInfo
    const apiSource = getApiSource(params.source)

    const lyricId = ((musicInfo.meta as Record<string, unknown>).lyric_id || musicInfo.meta.musicId) as string
    const cacheKey = `${apiSource}_${lyricId}`

    // Return cached lyrics immediately
    const cached = lyricCache.get(cacheKey)
    if (cached) {
      return {
        lyric: cached.lyric,
        tlyric: cached.tlyric,
        name: musicInfo.name,
        singer: musicInfo.singer,
        interval: musicInfo.interval,
      }
    }

    const result = await apiRequest({
      types: 'lyric',
      source: apiSource,
      id: lyricId,
    })

    const data = pickFirst(result) as Record<string, unknown> | undefined
    if (!data) {
      throw new Error('No lyrics returned from API')
    }

    const lyricResult = {
      lyric: (data.lyric as string) || '',
      tlyric: (data.tlyric as string) || null,
    }
    lyricCache.set(cacheKey, lyricResult)
    return {
      lyric: lyricResult.lyric,
      tlyric: lyricResult.tlyric,
      name: musicInfo.name,
      singer: musicInfo.singer,
      interval: musicInfo.interval,
    }
  },
}
