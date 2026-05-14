<script lang="ts">
  import { t } from '@/plugins/i18n'
  import TitleContent from '../components/TitleContent.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import { onMount } from 'svelte'
  import { showNotify } from '@/components/apis/notify'
  import {
    getMusicUrlCount,
    clearMusicUrl,
    getMusicLyricCount,
    clearMusicLyric,
    getMusicOtherSourceCount,
    clearMusicOtherSource,
    getDislikeListCount,
    clearDislikeList,
    getPlayCountCount,
    clearPlayCount,
    getDownloadListCount,
    clearDownloadList,
  } from '@/shared/ipc/music'
  import { clearAllQualities, getQualityCount } from '@/modules/player/store/qualityLabels.svelte'
  import { clearAllMeta, getMetaCount } from '@/modules/player/store/songMetaCache.svelte'

  let musicUrlCacheSize = $state(0)
  let musicLyricCacheSize = $state(0)
  let qualityLabelSize = $state(0)
  let songMetaCacheSize = $state(0)
  let otherSourceSize = $state(0)
  let dislikeListSize = $state(0)
  let playCountSize = $state(0)
  let downloadListSize = $state(0)

  onMount(() => {
    let mounted = true
    void getMusicUrlCount().then((count) => { if (!mounted) return; musicUrlCacheSize = count })
    void getMusicLyricCount().then((count) => { if (!mounted) return; musicLyricCacheSize = count })
    void getMusicOtherSourceCount().then((count) => { if (!mounted) return; otherSourceSize = count })
    void getDislikeListCount().then((count) => { if (!mounted) return; dislikeListSize = count })
    void getPlayCountCount().then((count) => { if (!mounted) return; playCountSize = count })
    void getDownloadListCount().then((count) => { if (!mounted) return; downloadListSize = count })
    qualityLabelSize = getQualityCount()
    songMetaCacheSize = getMetaCount()
    return () => { mounted = false }
  })

  const handleClear = async (clearFn: () => Promise<void>, setSize: (v: number) => void) => {
    await clearFn().catch((err: Error) => {
      showNotify($t('settings.other.clear_cache_failed', { msg: err.message }))
      throw err
    })
    setSize(0)
    showNotify($t('settings.other.clear_cache_success'))
  }

  const handleClearAll = async () => {
    try {
      if (musicUrlCacheSize) { await clearMusicUrl(); musicUrlCacheSize = 0 }
      if (musicLyricCacheSize) { await clearMusicLyric(); musicLyricCacheSize = 0 }
      if (otherSourceSize) { await clearMusicOtherSource(); otherSourceSize = 0 }
      if (dislikeListSize) { await clearDislikeList(); dislikeListSize = 0 }
      if (playCountSize) { await clearPlayCount(); playCountSize = 0 }
      if (downloadListSize) { await clearDownloadList(); downloadListSize = 0 }
      clearAllQualities()
      qualityLabelSize = 0
      clearAllMeta()
      songMetaCacheSize = 0
      showNotify($t('settings.other.clear_cache_success'))
    } catch (err) {
      showNotify($t('settings.other.clear_cache_failed', { msg: (err as Error).message }))
    }
  }
</script>

<TitleContent name={$t('settings.other.music_cache')}>
  <div class="settings-item-content">
    <div class="gap-top">
      <p class="p">{$t('settings.other.music_url_cache')}{musicUrlCacheSize}</p>
      <p class="p">{$t('settings.other.music_lyric_cache')}{musicLyricCacheSize}</p>
      <p class="p">{$t('settings.other.quality_label_cache')}{qualityLabelSize}</p>
      <p class="p">{$t('settings.other.song_meta_cache')}{songMetaCacheSize}</p>
      <p class="p">{$t('settings.other.music_other_source_cache')}{otherSourceSize}</p>
      <p class="p">{$t('settings.other.dislike_list_cache')}{dislikeListSize}</p>
      <p class="p">{$t('settings.other.play_count_cache')}{playCountSize}</p>
      <p class="p">{$t('settings.other.download_list_cache')}{downloadListSize}</p>
      <p class="p">
        <Btn min disabled={!musicUrlCacheSize} onclick={() => handleClear(clearMusicUrl, (v) => musicUrlCacheSize = v)}>
          {$t('settings.other.clear_music_url_cache')}
        </Btn>
        <Btn min disabled={!musicLyricCacheSize} onclick={() => handleClear(clearMusicLyric, (v) => musicLyricCacheSize = v)}>
          {$t('settings.other.clear_music_lyric_cache')}
        </Btn>
        <Btn min disabled={!qualityLabelSize} onclick={() => { clearAllQualities(); qualityLabelSize = 0; showNotify($t('settings.other.clear_cache_success')) }}>
          {$t('settings.other.clear_quality_label_cache')}
        </Btn>
        <Btn min disabled={!songMetaCacheSize} onclick={() => { clearAllMeta(); songMetaCacheSize = 0; showNotify($t('settings.other.clear_cache_success')) }}>
          {$t('settings.other.clear_song_meta_cache')}
        </Btn>
        <Btn min disabled={!otherSourceSize} onclick={() => handleClear(clearMusicOtherSource, (v) => otherSourceSize = v)}>
          {$t('settings.other.clear_music_other_source_cache')}
        </Btn>
        <Btn min disabled={!dislikeListSize} onclick={() => handleClear(clearDislikeList, (v) => dislikeListSize = v)}>
          {$t('settings.other.clear_dislike_list_cache')}
        </Btn>
        <Btn min disabled={!playCountSize} onclick={() => handleClear(clearPlayCount, (v) => playCountSize = v)}>
          {$t('settings.other.clear_play_count_cache')}
        </Btn>
        <Btn min disabled={!downloadListSize} onclick={() => handleClear(clearDownloadList, (v) => downloadListSize = v)}>
          {$t('settings.other.clear_download_list_cache')}
        </Btn>
        <Btn
          disabled={!musicUrlCacheSize && !musicLyricCacheSize && !qualityLabelSize && !songMetaCacheSize && !otherSourceSize && !dislikeListSize && !playCountSize && !downloadListSize}
          onclick={handleClearAll}
        >
          {$t('settings.other.clear_all_cache')}
        </Btn>
      </p>
    </div>
  </div>
</TitleContent>
